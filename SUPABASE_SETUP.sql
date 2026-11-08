-- YourOwnSpace code-only Game Session + optional shared notes
-- Run this once in the project's REAL Postgres SQL Editor (Database source), not Logs.
-- No Supabase Auth accounts are used by this version.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists yos_private;
revoke all on schema yos_private from public, anon, authenticated;

create table if not exists yos_private.session_codes (
  purpose text primary key check (purpose = 'shared'),
  code_hash text not null
);
revoke all on table yos_private.session_codes from public, anon, authenticated;
insert into yos_private.session_codes(purpose, code_hash)
values ('shared', extensions.crypt('000000', extensions.gen_salt('bf', 12)))
on conflict (purpose) do update set code_hash = excluded.code_hash;

create table if not exists yos_private.code_sessions (
  token_hash text primary key,
  session_scope text not null check (session_scope = 'shared'),
  player_name text not null check (player_name in ('Youness','Raouaa')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
revoke all on table yos_private.code_sessions from public, anon, authenticated;

create table if not exists public.yos_code_game_answers (
  session_scope text not null check (session_scope = 'shared'),
  player_name text not null check (player_name in ('Youness','Raouaa')),
  game_id text not null,
  question_id text not null,
  answer text not null,
  updated_at timestamptz not null default now(),
  primary key (session_scope, player_name, game_id, question_id)
);

create table if not exists public.yos_code_game_clues (
  game_id text not null,
  question_id text not null,
  clue_text text not null,
  updated_at timestamptz not null default now(),
  primary key (game_id, question_id)
);

create table if not exists public.yos_code_private_notes (
  id uuid primary key default gen_random_uuid(),
  session_scope text not null default 'shared' check (session_scope = 'shared'),
  owner_player text not null check (owner_player in ('Youness','Raouaa')),
  title text not null,
  content text not null,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.yos_code_game_answers enable row level security;
alter table public.yos_code_game_clues enable row level security;
alter table public.yos_code_private_notes enable row level security;
revoke all on public.yos_code_game_answers from public, anon, authenticated;
revoke all on public.yos_code_game_clues from public, anon, authenticated;
revoke all on public.yos_code_private_notes from public, anon, authenticated;

create or replace function public.yos_enter_game_session(p_code text, p_player_name text)
returns jsonb language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_hash text; v_token text; v_player text := trim(coalesce(p_player_name,''));
begin
  if v_player not in ('Youness','Raouaa') then raise exception 'Choose who is playing.'; end if;
  if p_code is null or trim(p_code) !~ '^[0-9]{6}$' then raise exception 'Enter six digits.'; end if;
  select code_hash into v_hash from yos_private.session_codes where purpose='shared';
  if v_hash is null or extensions.crypt(trim(p_code),v_hash) <> v_hash then raise exception 'That code does not match.'; end if;
  v_token := encode(extensions.gen_random_bytes(32),'hex');
  insert into yos_private.code_sessions(token_hash,session_scope,player_name,expires_at)
  values (encode(extensions.digest(v_token,'sha256'),'hex'),'shared',v_player,now()+interval '30 days');
  return jsonb_build_object('token',v_token,'scope','shared','player_name',v_player);
end;
$$;

create or replace function public.yos_save_answer(p_token text, p_game_id text, p_question_id text, p_answer text)
returns boolean language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype;
begin
  select * into v_session from yos_private.code_sessions
  where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  if p_game_id not in ('true-false','hot-takes','green-red','know-me','would-you-rather','never-have-i-ever','most-likely','guess-song') then raise exception 'Unknown game.'; end if;
  if p_question_id !~ '^[a-z0-9-]+-[0-9]{2}$' or length(coalesce(p_answer,''))=0 or length(p_answer)>500 then raise exception 'Invalid answer.'; end if;
  insert into public.yos_code_game_answers(session_scope,player_name,game_id,question_id,answer,updated_at)
  values('shared',v_session.player_name,p_game_id,p_question_id,p_answer,now())
  on conflict(session_scope,player_name,game_id,question_id) do update set answer=excluded.answer,updated_at=now();
  return true;
end;
$$;

create or replace function public.yos_get_answers(p_token text, p_game_id text)
returns jsonb language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype; v_rows jsonb;
begin
  select * into v_session from yos_private.code_sessions
  where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('player_name',player_name,'question_id',question_id,'answer',answer,'updated_at',updated_at) order by question_id,player_name),'[]'::jsonb)
  into v_rows from public.yos_code_game_answers where session_scope='shared' and game_id=p_game_id;
  return v_rows;
end;
$$;

create or replace function public.yos_get_clues(p_token text)
returns jsonb language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype; v_rows jsonb;
begin
  select * into v_session from yos_private.code_sessions where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('question_id',question_id,'clue_text',clue_text) order by question_id),'[]'::jsonb) into v_rows
  from public.yos_code_game_clues;
  return v_rows;
end;
$$;

create or replace function public.yos_save_clue(p_token text, p_question_id text, p_clue_text text)
returns boolean language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype;
begin
  select * into v_session from yos_private.code_sessions where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  if v_session.player_name <> 'Youness' then raise exception 'Only Youness can add the playlist clues.'; end if;
  if p_question_id !~ '^guess-song-[0-9]{2}$' or length(trim(coalesce(p_clue_text,'')))=0 or array_length(regexp_split_to_array(trim(p_clue_text),'\s+'),1)>10 then raise exception 'Use a short clue of ten words or fewer.'; end if;
  insert into public.yos_code_game_clues(game_id,question_id,clue_text,updated_at)
  values('guess-song',p_question_id,trim(p_clue_text),now())
  on conflict(game_id,question_id) do update set clue_text=excluded.clue_text,updated_at=now();
  return true;
end;
$$;

create or replace function public.yos_save_note(p_token text, p_title text, p_content text, p_is_shared boolean default false)
returns uuid language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype; v_id uuid;
begin
  select * into v_session from yos_private.code_sessions where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  if length(trim(coalesce(p_title,'')))=0 or length(p_title)>80 or length(coalesce(p_content,''))=0 or length(p_content)>8000 then raise exception 'Add a title and a note.'; end if;
  insert into public.yos_code_private_notes(owner_player,title,content,is_shared,updated_at)
  values(v_session.player_name,trim(p_title),trim(p_content),coalesce(p_is_shared,false),now()) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.yos_get_notes(p_token text)
returns jsonb language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype; v_rows jsonb;
begin
  select * into v_session from yos_private.code_sessions where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',id,'owner_player',owner_player,'title',title,'content',content,'is_shared',is_shared,'updated_at',updated_at) order by updated_at desc),'[]'::jsonb)
  into v_rows from public.yos_code_private_notes
  where session_scope='shared' and (is_shared or owner_player=v_session.player_name);
  return v_rows;
end;
$$;

create or replace function public.yos_delete_note(p_token text, p_note_id uuid)
returns boolean language plpgsql security definer
set search_path = public, extensions, yos_private, pg_temp
as $$
declare v_session yos_private.code_sessions%rowtype; v_count integer;
begin
  select * into v_session from yos_private.code_sessions where token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') and expires_at>now();
  if not found then raise exception 'Session expired. Enter the code again.'; end if;
  delete from public.yos_code_private_notes where id=p_note_id and owner_player=v_session.player_name;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

revoke all on function public.yos_enter_game_session(text,text) from public;
revoke all on function public.yos_save_answer(text,text,text,text) from public;
revoke all on function public.yos_get_answers(text,text) from public;
revoke all on function public.yos_get_clues(text) from public;
revoke all on function public.yos_save_clue(text,text,text) from public;
revoke all on function public.yos_save_note(text,text,text,boolean) from public;
revoke all on function public.yos_get_notes(text) from public;
revoke all on function public.yos_delete_note(text,uuid) from public;
grant execute on function public.yos_enter_game_session(text,text) to anon, authenticated;
grant execute on function public.yos_save_answer(text,text,text,text) to anon, authenticated;
grant execute on function public.yos_get_answers(text,text) to anon, authenticated;
grant execute on function public.yos_get_clues(text) to anon, authenticated;
grant execute on function public.yos_save_clue(text,text,text) to anon, authenticated;
grant execute on function public.yos_save_note(text,text,text,boolean) to anon, authenticated;
grant execute on function public.yos_get_notes(text) to anon, authenticated;
grant execute on function public.yos_delete_note(text,uuid) to anon, authenticated;
