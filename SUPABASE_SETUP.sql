-- Run this in Supabase SQL Editor when creating the cloud backend.
-- For production privacy, use Supabase Auth and per-user policies; never expose service_role keys.
create table if not exists public.shared_playlist (
  id uuid primary key default gen_random_uuid(),
  spotify_url text not null,
  added_at timestamptz not null default now(),
  added_by text
);
alter table public.shared_playlist enable row level security;
-- Temporary public read/insert policy for a private invite-only static site.
-- Replace with authenticated-user policies before putting sensitive data online.
create policy "playlist read" on public.shared_playlist for select using (true);
create policy "playlist add" on public.shared_playlist for insert with check (true);

create table if not exists public.private_vaults (
  vault_id text primary key,
  ciphertext jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.private_vaults enable row level security;
-- Do not enable public access to this table. Use authenticated access policies
-- and store only client-side encrypted ciphertext, never plaintext or raw codes.
