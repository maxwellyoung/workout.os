-- Create the workout_generations table
create table if not exists public.workout_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  workout_data jsonb,
  metadata jsonb
);

-- Create index on user_id and created_at for efficient queries
create index if not exists workout_generations_user_id_created_at_idx 
  on public.workout_generations(user_id, created_at);

-- Enable RLS
alter table public.workout_generations enable row level security;

-- Create RLS policies
create policy "Users can view own workout generations"
  on public.workout_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own workout generations"
  on public.workout_generations for insert
  with check (auth.uid() = user_id); 