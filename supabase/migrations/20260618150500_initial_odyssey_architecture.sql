create extension if not exists pgcrypto;

create schema if not exists private;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'publication_status') then
    create type public.publication_status as enum ('draft', 'published', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('trial', 'active', 'past_due', 'cancelled', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_owner_type') then
    create type public.contact_owner_type as enum ('realtor', 'developer');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_type') then
    create type public.contact_type as enum (
      'phone',
      'email',
      'facebook',
      'instagram',
      'linkedin',
      'messenger',
      'whatsapp',
      'viber',
      'website',
      'custom'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'media_role') then
    create type public.media_role as enum (
      'profile_photo',
      'developer_logo',
      'project_cover',
      'project_gallery',
      'project_sdp'
    );
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.owner_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

comment on table public.owner_admins is
  'Platform owner accounts. Bootstrap the first row with service role or direct SQL after the owner Supabase Auth user exists.';

create table public.realtors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  created_by_owner_id uuid references public.owner_admins(user_id) on delete set null,
  first_name text not null,
  last_name text not null,
  business_name text not null,
  catalog_slug text not null unique,
  title text,
  summary text,
  profile_photo_asset_id uuid,
  status text not null default 'active' check (status in ('active', 'suspended', 'deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.realtor_catalog_settings (
  realtor_id uuid primary key references public.realtors(id) on delete cascade,
  sidebar_brand_name text not null,
  header_main text not null,
  header_primary_subheader text not null,
  header_secondary_subheader text not null,
  public_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  developer_limit integer not null check (developer_limit >= 0),
  project_limit_per_developer integer not null check (project_limit_per_developer >= 0),
  project_image_limit integer not null check (project_image_limit >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.realtor_subscriptions (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.realtors(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id),
  status public.subscription_status not null default 'active',
  developer_limit_override integer check (developer_limit_override is null or developer_limit_override >= 0),
  project_limit_override integer check (project_limit_override is null or project_limit_override >= 0),
  project_image_limit_override integer check (project_image_limit_override is null or project_image_limit_override >= 0),
  first_login_code_hash text,
  first_login_code_created_at timestamptz,
  first_login_verified_at timestamptz,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.developers (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.realtors(id) on delete cascade,
  name text not null,
  slug text not null,
  specialty text not null,
  coverage text not null,
  description text not null,
  logo_asset_id uuid,
  publication_status public.publication_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (realtor_id, slug),
  unique (id, realtor_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.realtors(id) on delete cascade,
  developer_id uuid not null,
  title text not null,
  slug text not null,
  description text not null,
  location text not null,
  project_type text not null,
  status_label text,
  price_range text,
  total_lots_available integer check (total_lots_available is null or total_lots_available >= 0),
  levels text,
  lot_size_range text,
  completion_label text,
  map_address text,
  google_maps_url text,
  total_site_area text,
  road_reserve text,
  common_zones text,
  zoning text,
  sdp_reference text,
  publication_status public.publication_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (developer_id, slug),
  unique (id, realtor_id),
  constraint projects_developer_realtor_fk
    foreign key (developer_id, realtor_id)
    references public.developers(id, realtor_id)
    on delete cascade
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.realtors(id) on delete cascade,
  bucket text not null default 'realtor-media',
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  file_size_bytes integer not null check (file_size_bytes > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.realtors
  add constraint realtors_profile_photo_asset_fk
  foreign key (profile_photo_asset_id)
  references public.media_assets(id)
  on delete set null;

alter table public.developers
  add constraint developers_logo_asset_fk
  foreign key (logo_asset_id)
  references public.media_assets(id)
  on delete set null;

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  role public.media_role not null,
  sort_order integer not null default 0,
  caption text,
  alt_text text,
  created_at timestamptz not null default now(),
  check (role in ('project_cover', 'project_gallery', 'project_sdp'))
);

create table public.contact_links (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.realtors(id) on delete cascade,
  developer_id uuid references public.developers(id) on delete cascade,
  owner_type public.contact_owner_type not null,
  type public.contact_type not null,
  label text not null,
  value text not null,
  href text not null,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_links_owner_shape check (
    (owner_type = 'realtor' and developer_id is null)
    or
    (owner_type = 'developer' and developer_id is not null)
  ),
  constraint contact_links_developer_realtor_fk
    foreign key (developer_id, realtor_id)
    references public.developers(id, realtor_id)
    on delete cascade
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  realtor_id uuid references public.realtors(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table private.rate_limits (
  id bigint generated by default as identity primary key,
  key text not null,
  route text not null,
  requested_at timestamptz not null default now()
);

create index private_rate_limits_key_route_requested_idx
  on private.rate_limits(key, route, requested_at desc);

create or replace function private.is_owner_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.owner_admins
    where owner_admins.user_id = (select auth.uid())
  );
$$;

create or replace function private.current_realtor_id()
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select realtors.id
  from public.realtors
  where realtors.auth_user_id = (select auth.uid())
    and realtors.status = 'active'
  limit 1;
$$;

create trigger set_realtors_updated_at
  before update on public.realtors
  for each row execute function public.set_updated_at();

create trigger set_realtor_catalog_settings_updated_at
  before update on public.realtor_catalog_settings
  for each row execute function public.set_updated_at();

create trigger set_subscription_plans_updated_at
  before update on public.subscription_plans
  for each row execute function public.set_updated_at();

create trigger set_realtor_subscriptions_updated_at
  before update on public.realtor_subscriptions
  for each row execute function public.set_updated_at();

create trigger set_developers_updated_at
  before update on public.developers
  for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger set_contact_links_updated_at
  before update on public.contact_links
  for each row execute function public.set_updated_at();

create index realtors_auth_user_idx on public.realtors(auth_user_id);
create index realtors_catalog_slug_idx on public.realtors(catalog_slug);
create index realtors_created_by_owner_idx on public.realtors(created_by_owner_id);
create index realtors_profile_photo_asset_idx on public.realtors(profile_photo_asset_id);
create index realtor_subscriptions_realtor_idx on public.realtor_subscriptions(realtor_id);
create index realtor_subscriptions_plan_idx on public.realtor_subscriptions(plan_id);
create index realtor_subscriptions_first_login_idx
  on public.realtor_subscriptions(realtor_id, first_login_verified_at)
  where status in ('trial', 'active', 'past_due');
create index developers_logo_asset_idx on public.developers(logo_asset_id);
create index developers_realtor_status_idx on public.developers(realtor_id, publication_status, sort_order);
create index developers_realtor_slug_idx on public.developers(realtor_id, slug);
create index projects_realtor_status_idx on public.projects(realtor_id, publication_status, sort_order);
create index projects_developer_realtor_idx on public.projects(developer_id, realtor_id);
create index projects_developer_status_idx on public.projects(developer_id, publication_status, sort_order);
create index projects_developer_slug_idx on public.projects(developer_id, slug);
create index media_assets_realtor_idx on public.media_assets(realtor_id);
create index project_media_project_role_idx on public.project_media(project_id, role, sort_order);
create index project_media_media_asset_idx on public.project_media(media_asset_id);
create index contact_links_realtor_owner_idx on public.contact_links(realtor_id, owner_type, sort_order);
create index contact_links_developer_idx on public.contact_links(developer_id, sort_order);
create index contact_links_developer_realtor_idx on public.contact_links(developer_id, realtor_id);
create index audit_events_actor_created_idx on public.audit_events(actor_user_id, created_at desc);
create index audit_events_realtor_created_idx on public.audit_events(realtor_id, created_at desc);

create unique index one_current_subscription_per_realtor
  on public.realtor_subscriptions(realtor_id)
  where status in ('trial', 'active', 'past_due');

create unique index one_cover_per_project
  on public.project_media(project_id)
  where role = 'project_cover';

create unique index one_sdp_per_project
  on public.project_media(project_id)
  where role = 'project_sdp';

alter table public.owner_admins enable row level security;
alter table public.realtors enable row level security;
alter table public.realtor_catalog_settings enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.realtor_subscriptions enable row level security;
alter table public.developers enable row level security;
alter table public.projects enable row level security;
alter table public.media_assets enable row level security;
alter table public.project_media enable row level security;
alter table public.contact_links enable row level security;
alter table public.audit_events enable row level security;

create policy "owner admins can view owner admins"
  on public.owner_admins for select
  to authenticated
  using ((select private.is_owner_admin()) or user_id = (select auth.uid()));

create policy "owner admins can manage realtors"
  on public.realtors for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can view own realtor profile"
  on public.realtors for select
  to authenticated
  using (auth_user_id = (select auth.uid()));

create policy "realtors can update own realtor profile"
  on public.realtors for update
  to authenticated
  using (auth_user_id = (select auth.uid()))
  with check (auth_user_id = (select auth.uid()));

create policy "owner admins can manage catalog settings"
  on public.realtor_catalog_settings for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own catalog settings"
  on public.realtor_catalog_settings for all
  to authenticated
  using (realtor_id = (select private.current_realtor_id()))
  with check (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can manage subscription plans"
  on public.subscription_plans for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "authenticated users can view active subscription plans"
  on public.subscription_plans for select
  to authenticated
  using (is_active = true or (select private.is_owner_admin()));

create policy "owner admins can manage realtor subscriptions"
  on public.realtor_subscriptions for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can view own subscription"
  on public.realtor_subscriptions for select
  to authenticated
  using (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can manage developers"
  on public.developers for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own developers"
  on public.developers for all
  to authenticated
  using (realtor_id = (select private.current_realtor_id()))
  with check (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can manage projects"
  on public.projects for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own projects"
  on public.projects for all
  to authenticated
  using (realtor_id = (select private.current_realtor_id()))
  with check (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can manage media assets"
  on public.media_assets for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own media assets"
  on public.media_assets for all
  to authenticated
  using (realtor_id = (select private.current_realtor_id()))
  with check (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can manage project media"
  on public.project_media for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own project media"
  on public.project_media for all
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.realtor_id = (select private.current_realtor_id())
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.realtor_id = (select private.current_realtor_id())
    )
  );

create policy "owner admins can manage contact links"
  on public.contact_links for all
  to authenticated
  using ((select private.is_owner_admin()))
  with check ((select private.is_owner_admin()));

create policy "realtors can manage own contact links"
  on public.contact_links for all
  to authenticated
  using (realtor_id = (select private.current_realtor_id()))
  with check (realtor_id = (select private.current_realtor_id()));

create policy "owner admins can view audit events"
  on public.audit_events for select
  to authenticated
  using ((select private.is_owner_admin()));

create policy "realtors can view own audit events"
  on public.audit_events for select
  to authenticated
  using (realtor_id = (select private.current_realtor_id()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'realtor-media',
  'realtor-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "owner admins can manage all realtor media objects"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'realtor-media' and (select private.is_owner_admin()))
  with check (bucket_id = 'realtor-media' and (select private.is_owner_admin()));

create policy "realtors can manage own media folder"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'realtor-media'
    and (storage.foldername(name))[1] = 'realtors'
    and (storage.foldername(name))[2] = (select private.current_realtor_id())::text
  )
  with check (
    bucket_id = 'realtor-media'
    and (storage.foldername(name))[1] = 'realtors'
    and (storage.foldername(name))[2] = (select private.current_realtor_id())::text
  );

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
grant select, insert, update, delete on public.owner_admins to authenticated;
grant select, insert, update, delete on public.realtors to authenticated;
grant select, insert, update, delete on public.realtor_catalog_settings to authenticated;
grant select, insert, update, delete on public.subscription_plans to authenticated;
grant select, insert, update, delete on public.realtor_subscriptions to authenticated;
grant select, insert, update, delete on public.developers to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;
grant select, insert, update, delete on public.project_media to authenticated;
grant select, insert, update, delete on public.contact_links to authenticated;
grant select on public.audit_events to authenticated;

grant usage on schema private to authenticated, service_role;
grant select, insert, delete on private.rate_limits to service_role;
grant execute on function private.is_owner_admin() to authenticated, service_role;
grant execute on function private.current_realtor_id() to authenticated, service_role;

revoke all on schema private from anon;
revoke all on all tables in schema private from anon, authenticated;
revoke all on function private.is_owner_admin() from anon, public;
revoke all on function private.current_realtor_id() from anon, public;
