alter table public.realtor_subscriptions
  add column if not exists first_login_code_hash text,
  add column if not exists first_login_code_created_at timestamptz,
  add column if not exists first_login_verified_at timestamptz;

create index if not exists realtor_subscriptions_first_login_idx
  on public.realtor_subscriptions(realtor_id, first_login_verified_at)
  where status in ('trial', 'active', 'past_due');
