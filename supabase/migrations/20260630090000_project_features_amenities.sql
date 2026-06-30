alter table public.projects
  add column if not exists features_amenities text[] not null default '{}';
