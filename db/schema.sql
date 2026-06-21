-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  city text,
  age integer,
  family_status text check (family_status in ('single', 'couple', 'family_with_kids', 'other')),
  stated_values text[], -- e.g. ['environment', 'health', 'cost', 'time']
  created_at timestamptz default now()
);

-- Simulations table
create table public.simulations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text, -- for anonymous users
  decision_type text not null check (decision_type in (
    'housing', 'transport', 'job', 'diet', 'travel', 'purchase'
  )),
  option_a jsonb not null,  -- { label, inputs, result }
  option_b jsonb not null,  -- { label, inputs, result }
  chosen_option text check (chosen_option in ('A', 'B', 'neither')),
  created_at timestamptz default now()
);

-- Letters table
create table public.letters (
  id uuid default uuid_generate_v4() primary key,
  simulation_id uuid references public.simulations(id) on delete cascade,
  chosen_trajectory text check (chosen_trajectory in ('A', 'B')),
  tone text check (tone in ('reflective', 'direct', 'scientific', 'emotional')),
  letter_text text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.simulations enable row level security;
alter table public.letters enable row level security;

-- RLS Policies
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can read own simulations"
  on public.simulations for select
  using (auth.uid() = user_id or session_id = current_setting('app.session_id', true));

create policy "Anyone can insert simulations"
  on public.simulations for insert with check (true);

create policy "Users can read own letters"
  on public.letters for select
  using (
    exists (
      select 1 from public.simulations s
      where s.id = simulation_id
      and (s.user_id = auth.uid() or s.session_id = current_setting('app.session_id', true))
    )
  );

create policy "Anyone can insert letters"
  on public.letters for insert with check (true);
