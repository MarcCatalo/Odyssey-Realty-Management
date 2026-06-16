create type publication_status as enum ('draft', 'published', 'archived');

create table developers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  specialty text,
  description text,
  coverage text,
  logo_url text,
  banner_image_url text,
  status publication_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table developer_contact_links (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references developers(id) on delete cascade,
  type text not null,
  label text not null,
  value text,
  url text not null,
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sales_agent_contact_links (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  label text not null,
  value text,
  url text not null,
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references developers(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  location text,
  project_type text,
  status_label text,
  price_range text,
  cover_image_url text,
  sdp_image_url text,
  sdp_description text,
  google_maps_url text,
  publication_status publication_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (developer_id, slug)
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  is_cover_candidate boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table developers enable row level security;
alter table developer_contact_links enable row level security;
alter table sales_agent_contact_links enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;

create policy "Public can read published developers"
  on developers for select
  using (status = 'published');

create policy "Public can read enabled developer contacts for published developers"
  on developer_contact_links for select
  using (
    is_enabled = true and exists (
      select 1 from developers
      where developers.id = developer_contact_links.developer_id
      and developers.status = 'published'
    )
  );

create policy "Public can read enabled sales-agent contacts"
  on sales_agent_contact_links for select
  using (is_enabled = true);

create policy "Public can read published projects"
  on projects for select
  using (
    publication_status = 'published' and exists (
      select 1 from developers
      where developers.id = projects.developer_id
      and developers.status = 'published'
    )
  );

create policy "Public can read images for published projects"
  on project_images for select
  using (
    exists (
      select 1 from projects
      join developers on developers.id = projects.developer_id
      where projects.id = project_images.project_id
      and projects.publication_status = 'published'
      and developers.status = 'published'
    )
  );
