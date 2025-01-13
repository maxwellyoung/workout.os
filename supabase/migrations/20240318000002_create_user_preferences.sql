-- Create the user_preferences table
create table if not exists public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  fitness_goal text check (fitness_goal in ('strength', 'endurance', 'weight-loss', 'muscle-gain')) not null,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')) not null,
  workout_days integer check (workout_days between 1 and 7) not null,
  equipment text[] default '{}',
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on user_id
create index if not exists user_preferences_user_id_idx on public.user_preferences(user_id);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Create RLS policies
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_user_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.handle_updated_at(); 