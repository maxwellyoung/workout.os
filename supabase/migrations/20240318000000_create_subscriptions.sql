-- Create the subscriptions table if it doesn't exist
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')) not null,
  price_id text,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  ended_at timestamp with time zone,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  metadata jsonb
);

-- Create index on user_id
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Create RLS policies
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Create function to create subscriptions table
create or replace function public.create_subscriptions_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if table exists
  if not exists (
    select from pg_tables
    where schemaname = 'public'
    and tablename = 'subscriptions'
  ) then
    -- Create the table
    create table public.subscriptions (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id) on delete cascade not null,
      status text check (status in ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')) not null,
      price_id text,
      quantity integer,
      cancel_at_period_end boolean,
      created timestamp with time zone default timezone('utc'::text, now()) not null,
      current_period_start timestamp with time zone,
      current_period_end timestamp with time zone,
      ended_at timestamp with time zone,
      cancel_at timestamp with time zone,
      canceled_at timestamp with time zone,
      trial_start timestamp with time zone,
      trial_end timestamp with time zone,
      metadata jsonb
    );

    -- Create index
    create index subscriptions_user_id_idx on public.subscriptions(user_id);

    -- Enable RLS
    alter table public.subscriptions enable row level security;

    -- Create policies
    create policy "Users can view own subscription"
      on public.subscriptions for select
      using (auth.uid() = user_id);
  end if;
end;
$$; 