-- YOUR OWN SPACE — Supabase database setup
-- Run this in the REAL project Database SQL Editor (not Logs/Log Explorer).
-- This script uses yos_* table names so it will not collide with the earlier empty `profiles` table.
-- Re-running is intended to be safe. Never put a service_role key in the website.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
set search_path = public, extensions;
create schema if not exists yos_private;
revoke all on schema yos_private from public, anon, authenticated;

create table if not exists yos_private.session_codes (
  purpose text primary key check (purpose in ('shared','test')),
  code_hash text not null
);
revoke all on table yos_private.session_codes from public, anon, authenticated;
insert into yos_private.session_codes(purpose,code_hash)
values ('shared', crypt('000000', gen_salt('bf', 12))),
       ('test', '$2a$12$K4y1sac12bR4yUrKIOM5xu8.TZ3gZuFiGKXEbRYmpXMs2K4L.QR0a')
on conflict (purpose) do update set code_hash = excluded.code_hash;

create table if not exists public.yos_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Player',
  created_at timestamptz not null default now()
);
create table if not exists public.yos_workspace_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now()
);
create table if not exists public.yos_game_answers (
  session_scope text not null check (session_scope in ('shared','test')),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null,
  question_id text not null,
  answer text not null,
  updated_at timestamptz not null default now(),
  primary key (session_scope,user_id,game_id,question_id)
);
create table if not exists public.yos_game_clues (
  game_id text not null,
  question_id text not null,
  clue_text text not null,
  updated_at timestamptz not null default now(),
  primary key (game_id,question_id)
);
create table if not exists public.yos_private_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Private note',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.yos_private_shares (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.yos_private_items(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(item_id,recipient_id),
  check(owner_id <> recipient_id)
);

create or replace function public.yos_is_workspace_member()
returns boolean language sql stable security definer
set search_path = public, extensions, pg_temp
as $$ select exists(select 1 from public.yos_workspace_members where user_id = auth.uid()); $$;

create or replace function public.yos_is_workspace_owner()
returns boolean language sql stable security definer
set search_path = public, extensions, pg_temp
as $$ select exists(select 1 from public.yos_workspace_members where user_id = auth.uid() and role = 'owner'); $$;

create or replace function public.yos_can_read_private_item(p_item_id uuid)
returns boolean language sql stable security definer
set search_path = public, extensions, pg_temp
as $$
  select exists(select 1 from public.yos_private_items i where i.id=p_item_id and i.owner_id=auth.uid())
      or exists(select 1 from public.yos_private_shares s where s.item_id=p_item_id and s.recipient_id=auth.uid());
$$;

create or replace function public.yos_create_profile_for_new_user()
returns trigger language plpgsql security definer
set search_path = public, extensions, pg_temp
as $$
begin
  insert into public.yos_profiles(user_id,display_name)
  values(new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1), 'Player'))
  on conflict(user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists yos_on_auth_user_created on auth.users;
create trigger yos_on_auth_user_created after insert on auth.users
for each row execute procedure public.yos_create_profile_for_new_user();

create or replace function public.yos_claim_workspace_owner(p_display_name text default null)
returns text language plpgsql security definer
set search_path = public, extensions, pg_temp
as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Sign in first.'; end if;
  perform pg_advisory_xact_lock(hashtext('yos_workspace_owner_bootstrap'));
  if exists(select 1 from public.yos_workspace_members where role='owner' and user_id=v_uid) then return 'owner'; end if;
  if exists(select 1 from public.yos_workspace_members where role='owner') then raise exception 'The workspace already has an owner. Ask them to join you with the shared session code.'; end if;
  insert into public.yos_workspace_members(user_id,role) values(v_uid,'owner') on conflict(user_id) do update set role='owner';
  insert into public.yos_profiles(user_id,display_name) values(v_uid,coalesce(nullif(trim(p_display_name),''),'Owner'))
  on conflict(user_id) do update set display_name=excluded.display_name;
  return 'owner';
end;
$$;

create or replace function public.yos_enter_game_session(p_code text, p_display_name text default null)
returns text language plpgsql security definer
set search_path = public, extensions, pg_temp
as $$
declare v_uid uuid := auth.uid(); v_hash text; v_role text;
begin
  if v_uid is null then raise exception 'Sign in first.'; end if;
  if p_code is null or length(trim(p_code)) <> 6 or trim(p_code) !~ '^[0-9]{6}$' then raise exception 'Enter a six-digit code.'; end if;
  select code_hash into v_hash from yos_private.session_codes where purpose='test';
  if v_hash is not null and crypt(trim(p_code),v_hash)=v_hash then
    select role into v_role from public.yos_workspace_members where user_id=v_uid;
    if v_role is distinct from 'owner' then raise exception 'That test session is not available for this account.'; end if;
    return 'test';
  end if;
  select code_hash into v_hash from yos_private.session_codes where purpose='shared';
  if v_hash is not null and crypt(trim(p_code),v_hash)=v_hash then
    if not exists(select 1 from public.yos_workspace_members where role='owner') then raise exception 'The workspace has not been initialized yet. The first player must initialize it first.'; end if;
    if not exists(select 1 from public.yos_workspace_members where user_id=v_uid)
       and (select count(*) from public.yos_workspace_members) >= 2 then
      raise exception 'This private workspace already has its two members.';
    end if;
    insert into public.yos_workspace_members(user_id,role) values(v_uid,'member') on conflict(user_id) do nothing;
    insert into public.yos_profiles(user_id,display_name) values(v_uid,coalesce(nullif(trim(p_display_name),''),'Player'))
    on conflict(user_id) do update set display_name=case when trim(coalesce(p_display_name,''))='' then public.yos_profiles.display_name else excluded.display_name end;
    return 'shared';
  end if;
  raise exception 'Incorrect session code.';
end;
$$;

-- RLS helpers and policies
alter table public.yos_profiles enable row level security;
alter table public.yos_workspace_members enable row level security;
alter table public.yos_game_answers enable row level security;
alter table public.yos_game_clues enable row level security;
alter table public.yos_private_items enable row level security;
alter table public.yos_private_shares enable row level security;

drop policy if exists yos_profiles_read on public.yos_profiles;
create policy yos_profiles_read on public.yos_profiles for select to authenticated
using (user_id=auth.uid() or public.yos_is_workspace_member());
drop policy if exists yos_profiles_update_self on public.yos_profiles;
create policy yos_profiles_update_self on public.yos_profiles for update to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());

drop policy if exists yos_members_read on public.yos_workspace_members;
create policy yos_members_read on public.yos_workspace_members for select to authenticated
using (user_id=auth.uid() or public.yos_is_workspace_member());

drop policy if exists yos_answers_read on public.yos_game_answers;
create policy yos_answers_read on public.yos_game_answers for select to authenticated
using ((session_scope='shared' and public.yos_is_workspace_member()) or (session_scope='test' and public.yos_is_workspace_owner()));
drop policy if exists yos_answers_insert on public.yos_game_answers;
create policy yos_answers_insert on public.yos_game_answers for insert to authenticated
with check (user_id=auth.uid() and ((session_scope='shared' and public.yos_is_workspace_member()) or (session_scope='test' and public.yos_is_workspace_owner())));
drop policy if exists yos_answers_update on public.yos_game_answers;
create policy yos_answers_update on public.yos_game_answers for update to authenticated
using (user_id=auth.uid() and ((session_scope='shared' and public.yos_is_workspace_member()) or (session_scope='test' and public.yos_is_workspace_owner())))
with check (user_id=auth.uid() and ((session_scope='shared' and public.yos_is_workspace_member()) or (session_scope='test' and public.yos_is_workspace_owner())));
drop policy if exists yos_answers_delete on public.yos_game_answers;
create policy yos_answers_delete on public.yos_game_answers for delete to authenticated
using (user_id=auth.uid() and ((session_scope='shared' and public.yos_is_workspace_member()) or (session_scope='test' and public.yos_is_workspace_owner())));

drop policy if exists yos_clues_read on public.yos_game_clues;
create policy yos_clues_read on public.yos_game_clues for select to authenticated using (public.yos_is_workspace_member());
drop policy if exists yos_clues_insert_owner on public.yos_game_clues;
create policy yos_clues_insert_owner on public.yos_game_clues for insert to authenticated with check (public.yos_is_workspace_owner());
drop policy if exists yos_clues_update_owner on public.yos_game_clues;
create policy yos_clues_update_owner on public.yos_game_clues for update to authenticated using (public.yos_is_workspace_owner()) with check (public.yos_is_workspace_owner());

drop policy if exists yos_private_items_read on public.yos_private_items;
create policy yos_private_items_read on public.yos_private_items for select to authenticated using (public.yos_can_read_private_item(id));
drop policy if exists yos_private_items_insert on public.yos_private_items;
create policy yos_private_items_insert on public.yos_private_items for insert to authenticated with check (owner_id=auth.uid() and public.yos_is_workspace_member());
drop policy if exists yos_private_items_update on public.yos_private_items;
create policy yos_private_items_update on public.yos_private_items for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
drop policy if exists yos_private_items_delete on public.yos_private_items;
create policy yos_private_items_delete on public.yos_private_items for delete to authenticated using (owner_id=auth.uid());

drop policy if exists yos_private_shares_read on public.yos_private_shares;
create policy yos_private_shares_read on public.yos_private_shares for select to authenticated using (owner_id=auth.uid() or recipient_id=auth.uid());
drop policy if exists yos_private_shares_insert on public.yos_private_shares;
create policy yos_private_shares_insert on public.yos_private_shares for insert to authenticated
with check (owner_id=auth.uid() and public.yos_is_workspace_member() and exists(select 1 from public.yos_private_items i where i.id=item_id and i.owner_id=auth.uid()) and exists(select 1 from public.yos_workspace_members m where m.user_id=recipient_id));
drop policy if exists yos_private_shares_delete on public.yos_private_shares;
create policy yos_private_shares_delete on public.yos_private_shares for delete to authenticated using (owner_id=auth.uid());

-- Explicit grants for the browser client. RLS remains the access boundary.
grant usage on schema public to authenticated;
grant select, update on public.yos_profiles to authenticated;
grant select on public.yos_workspace_members to authenticated;
grant select, insert, update, delete on public.yos_game_answers to authenticated;
grant select, insert, update on public.yos_game_clues to authenticated;
grant select, insert, update, delete on public.yos_private_items to authenticated;
grant select, insert, delete on public.yos_private_shares to authenticated;
grant execute on function public.yos_claim_workspace_owner(text) to authenticated;
grant execute on function public.yos_enter_game_session(text,text) to authenticated;
revoke all on function public.yos_claim_workspace_owner(text) from public, anon;
revoke all on function public.yos_enter_game_session(text,text) from public, anon;
