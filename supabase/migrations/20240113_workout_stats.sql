-- Create workout_stats table
create table if not exists public.workout_stats (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    raw_input text not null,
    processed_data jsonb,
    type text check (type in ('intention', 'completion')),
    exercise text,
    weight numeric,
    sets integer,
    reps integer,
    intensity text check (intensity in ('low', 'medium', 'high')),
    mood text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.workout_stats enable row level security;

create policy "Users can insert their own workout stats"
    on public.workout_stats for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own workout stats"
    on public.workout_stats for select
    using (auth.uid() = user_id);

-- Create index for faster queries
create index workout_stats_user_id_idx on public.workout_stats(user_id);
create index workout_stats_created_at_idx on public.workout_stats(created_at);

-- Add type for workout preferences
create type public.fitness_goal as enum (
    'strength',
    'hypertrophy',
    'endurance',
    'weight_loss',
    'general_fitness'
);

create type public.experience_level as enum (
    'beginner',
    'intermediate',
    'advanced'
);

-- Create user preferences table
create table if not exists public.user_fitness_preferences (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null unique,
    primary_goal fitness_goal not null default 'general_fitness',
    experience_level experience_level not null default 'beginner',
    available_equipment text[],
    preferred_workout_days integer not null default 3,
    workout_duration_minutes integer not null default 60,
    injury_considerations text[],
    target_muscle_groups text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for preferences
alter table public.user_fitness_preferences enable row level security;

create policy "Users can insert their own preferences"
    on public.user_fitness_preferences for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
    on public.user_fitness_preferences for update
    using (auth.uid() = user_id);

create policy "Users can view their own preferences"
    on public.user_fitness_preferences for select
    using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger handle_updated_at
    before update on public.user_fitness_preferences
    for each row
    execute function public.handle_updated_at(); 