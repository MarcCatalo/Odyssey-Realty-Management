alter table public.subscription_plans
  rename column storage_limit_mb to project_image_limit;

alter table public.realtor_subscriptions
  rename column storage_limit_mb_override to project_image_limit_override;

insert into public.subscription_plans (
  name,
  developer_limit,
  project_limit_per_developer,
  project_image_limit,
  is_active
)
values
  ('Base Catalog', 6, 6, 12, true),
  ('Growth Catalog', 12, 10, 20, true),
  ('Pro Catalog', 20, 15, 30, true),
  ('Agency Catalog', 35, 20, 40, true)
on conflict (name) do update
set
  developer_limit = excluded.developer_limit,
  project_limit_per_developer = excluded.project_limit_per_developer,
  project_image_limit = excluded.project_image_limit,
  is_active = excluded.is_active,
  updated_at = now();
