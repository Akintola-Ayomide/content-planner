-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "users_can_view_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users_can_insert_own_profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users_can_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users_can_delete_own_profile"
  on public.profiles for delete
  using (auth.uid() = id);
