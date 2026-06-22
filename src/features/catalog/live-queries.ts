import { unstable_cache } from "next/cache";

import { salesAgent as fallbackSalesAgent } from "@/features/catalog/data";
import type { ContactLink, Developer, Project, ProjectImage, SalesAgent } from "@/features/catalog/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  publicCatalogTag,
  realtorCatalogTag,
  realtorSubscriptionTag
} from "@/server/cache/catalog-cache-tags";
import type { SubscriptionLimits } from "@/server/services/subscription-limits";

type CatalogBundle = {
  salesAgent: SalesAgent;
  developers: Developer[];
  projects: Project[];
};

type RealtorRow = {
  id: string;
  first_name: string;
  last_name: string;
  business_name: string;
  catalog_slug: string;
  title: string | null;
  summary: string | null;
};

type CatalogSettingsRow = {
  sidebar_brand_name: string;
  header_main: string;
  header_primary_subheader: string;
  header_secondary_subheader: string;
  public_summary: string | null;
};

type DeveloperRow = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  coverage: string;
  description: string;
  publication_status: "draft" | "published" | "archived";
  logo_asset_id: string | null;
};

type ProjectRow = {
  id: string;
  developer_id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  project_type: string;
  status_label: string | null;
  price_range: string | null;
  total_lots_available: number | null;
  levels: string | null;
  lot_size_range: string | null;
  completion_label: string | null;
  map_address: string | null;
  google_maps_url: string | null;
  total_site_area: string | null;
  road_reserve: string | null;
  common_zones: string | null;
  zoning: string | null;
  sdp_reference: string | null;
  publication_status: "draft" | "published" | "archived";
};

type ContactRow = {
  id: string;
  developer_id: string | null;
  owner_type: "realtor" | "developer";
  type: ContactLink["type"];
  label: string;
  value: string;
  href: string;
  is_enabled: boolean;
};

type MediaRow = {
  id: string;
  project_id: string;
  role: "project_cover" | "project_gallery" | "project_sdp";
  sort_order: number;
  caption: string | null;
  alt_text: string | null;
  media_assets:
    | {
        id: string;
        storage_path: string;
        alt_text: string | null;
        caption: string | null;
      }
    | null;
};

type SubscriptionRow = {
  developer_limit_override: number | null;
  project_limit_override: number | null;
  project_image_limit_override: number | null;
  subscription_plans:
    | {
        developer_limit: number;
        project_limit_per_developer: number;
        project_image_limit: number;
      }
    | null;
};

const defaultCatalogSlug = process.env.DEFAULT_PUBLIC_CATALOG_SLUG ?? "homil-test-realty";

const placeholder = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

const fallbackCover: ProjectImage = {
  id: "fallback-cover",
  src: placeholder("1600585154340-be6161a56a0c"),
  alt: "Modern house exterior",
  caption: "Exterior view"
};

const fallbackSdp: ProjectImage = {
  id: "fallback-sdp",
  src: placeholder("1500530855697-b586d89ba3ee"),
  alt: "Site development plan reference image",
  caption: "Site development plan"
};

export function getPublicCatalog(): Promise<CatalogBundle> {
  return unstable_cache(getPublicCatalogUncached, ["public-catalog", defaultCatalogSlug], {
    tags: [publicCatalogTag],
    revalidate: 60 * 60
  })();
}

async function getPublicCatalogUncached(): Promise<CatalogBundle> {
  const client = createServerSupabaseClient();

  if (!client) {
    return { salesAgent: fallbackSalesAgent, developers: [], projects: [] };
  }

  const { data: realtor } = await client
    .from("realtors")
    .select("id,first_name,last_name,business_name,catalog_slug,title,summary")
    .eq("catalog_slug", defaultCatalogSlug)
    .eq("status", "active")
    .maybeSingle<RealtorRow>();

  const resolvedRealtor = realtor ?? (await getFirstActiveRealtor());

  if (!resolvedRealtor) {
    return { salesAgent: fallbackSalesAgent, developers: [], projects: [] };
  }

  return getCatalogForRealtor(resolvedRealtor.id, resolvedRealtor);
}

export function getCatalogForRealtorId(realtorId: string): Promise<CatalogBundle> {
  return unstable_cache(
    () => getCatalogForRealtorIdUncached(realtorId),
    ["realtor-catalog", realtorId],
    {
      tags: [realtorCatalogTag(realtorId)],
      revalidate: 60 * 60
    }
  )();
}

async function getCatalogForRealtorIdUncached(realtorId: string): Promise<CatalogBundle> {
  const client = createServerSupabaseClient();

  if (!client) {
    return { salesAgent: fallbackSalesAgent, developers: [], projects: [] };
  }

  const { data: realtor, error } = await client
    .from("realtors")
    .select("id,first_name,last_name,business_name,catalog_slug,title,summary")
    .eq("id", realtorId)
    .maybeSingle<RealtorRow>();

  if (error || !realtor) {
    return { salesAgent: fallbackSalesAgent, developers: [], projects: [] };
  }

  return getCatalogForRealtor(realtorId, realtor);
}

export function getRealtorSubscriptionLimits(realtorId: string): Promise<SubscriptionLimits> {
  return unstable_cache(
    () => getRealtorSubscriptionLimitsUncached(realtorId),
    ["realtor-subscription", realtorId],
    {
      tags: [realtorSubscriptionTag(realtorId)],
      revalidate: 60 * 60
    }
  )();
}

async function getRealtorSubscriptionLimitsUncached(realtorId: string): Promise<SubscriptionLimits> {
  const client = createServerSupabaseClient();

  if (!client) {
    return { developerLimit: 0, projectLimitPerDeveloper: 0, projectImageLimit: 0 };
  }

  const { data } = await client
    .from("realtor_subscriptions")
    .select(
      "developer_limit_override,project_limit_override,project_image_limit_override,subscription_plans(developer_limit,project_limit_per_developer,project_image_limit)"
    )
    .eq("realtor_id", realtorId)
    .in("status", ["trial", "active", "past_due"])
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  return {
    developerLimit: data?.developer_limit_override ?? data?.subscription_plans?.developer_limit ?? 0,
    projectLimitPerDeveloper:
      data?.project_limit_override ?? data?.subscription_plans?.project_limit_per_developer ?? 0,
    projectImageLimit: data?.project_image_limit_override ?? data?.subscription_plans?.project_image_limit ?? 0
  };
}

async function getFirstActiveRealtor() {
  const client = createServerSupabaseClient();

  if (!client) {
    return null;
  }

  const { data } = await client
    .from("realtors")
    .select("id,first_name,last_name,business_name,catalog_slug,title,summary")
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<RealtorRow>();

  return data;
}

async function getCatalogForRealtor(realtorId: string, realtor: RealtorRow): Promise<CatalogBundle> {
  const client = createServerSupabaseClient();

  if (!client) {
    return { salesAgent: fallbackSalesAgent, developers: [], projects: [] };
  }

  const [settingsResult, developersResult, projectsResult, contactsResult, mediaResult] =
    await Promise.all([
      client
        .from("realtor_catalog_settings")
        .select("sidebar_brand_name,header_main,header_primary_subheader,header_secondary_subheader,public_summary")
        .eq("realtor_id", realtorId)
        .maybeSingle<CatalogSettingsRow>(),
      client
        .from("developers")
        .select("id,name,slug,specialty,coverage,description,publication_status,logo_asset_id")
        .eq("realtor_id", realtorId)
        .neq("publication_status", "archived")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      client
        .from("projects")
        .select(
          "id,developer_id,title,slug,description,location,project_type,status_label,price_range,total_lots_available,levels,lot_size_range,completion_label,map_address,google_maps_url,total_site_area,road_reserve,common_zones,zoning,sdp_reference,publication_status"
        )
        .eq("realtor_id", realtorId)
        .neq("publication_status", "archived")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      client
        .from("contact_links")
        .select("id,developer_id,owner_type,type,label,value,href,is_enabled")
        .eq("realtor_id", realtorId)
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
      client
        .from("project_media")
        .select("id,project_id,role,sort_order,caption,alt_text,media_assets(id,storage_path,alt_text,caption)")
        .order("sort_order", { ascending: true })
    ]);

  const developerRows = (developersResult.data ?? []) as DeveloperRow[];
  const projectRows = ((projectsResult.data ?? []) as ProjectRow[]).filter((project) =>
    developerRows.some((developer) => developer.id === project.developer_id)
  );
  const contacts = (contactsResult.data ?? []) as ContactRow[];
  const mediaRows = ((mediaResult.data ?? []) as unknown as MediaRow[]).filter((media) =>
    projectRows.some((project) => project.id === media.project_id)
  );
  const mediaByProject = await buildMediaByProject(mediaRows);
  const projectCounts = new Map<string, number>();

  projectRows.forEach((project) => {
    projectCounts.set(project.developer_id, (projectCounts.get(project.developer_id) ?? 0) + 1);
  });

  const salesAgent = mapSalesAgent(realtor, settingsResult.data ?? null, contacts);
  const developers = developerRows.map((developer) =>
    mapDeveloper(developer, contacts, projectCounts.get(developer.id) ?? 0)
  );
  const projects = projectRows.map((project) => mapProject(project, mediaByProject.get(project.id)));

  return { salesAgent, developers, projects };
}

async function buildMediaByProject(mediaRows: MediaRow[]) {
  const client = createServerSupabaseClient();
  const mediaByProject = new Map<string, ProjectImage[]>();

  await Promise.all(
    mediaRows.map(async (media) => {
      const asset = media.media_assets;

      if (!client || !asset?.storage_path) {
        return;
      }

      const { data } = await client.storage.from("realtor-media").createSignedUrl(asset.storage_path, 60 * 60);
      const image: ProjectImage = {
        id: media.id,
        src: data?.signedUrl ?? fallbackCover.src,
        alt: media.alt_text ?? asset.alt_text ?? asset.caption ?? media.caption ?? "Project image",
        caption: media.caption ?? asset.caption ?? "Project image"
      };
      const existing = mediaByProject.get(media.project_id) ?? [];
      existing.push({ ...image, id: `${media.role}:${image.id}` });
      mediaByProject.set(media.project_id, existing);
    })
  );

  return mediaByProject;
}

function mapSalesAgent(realtor: RealtorRow, settings: CatalogSettingsRow | null, contacts: ContactRow[]): SalesAgent {
  const contactLinks = contacts.filter((contact) => contact.owner_type === "realtor").map(mapContact);
  const socials = contactLinks.filter((contact) =>
    ["facebook", "instagram", "linkedin", "messenger", "whatsapp", "viber", "website", "custom"].includes(contact.type)
  );

  return {
    businessLabel: realtor.business_name,
    catalogSlug: realtor.catalog_slug,
    headerMain: settings?.header_main ?? fallbackSalesAgent.headerMain,
    headerPrimarySubheader: settings?.header_primary_subheader ?? fallbackSalesAgent.headerPrimarySubheader,
    headerSecondarySubheader: settings?.header_secondary_subheader ?? fallbackSalesAgent.headerSecondarySubheader,
    name: realtor.business_name,
    socials,
    title: realtor.title ?? "Sales Agent Network",
    summary: realtor.summary ?? settings?.public_summary ?? fallbackSalesAgent.summary,
    contactLinks
  };
}

function mapDeveloper(developer: DeveloperRow, contacts: ContactRow[], projectCount: number): Developer {
  return {
    id: developer.id,
    name: developer.name,
    slug: developer.slug,
    specialty: developer.specialty,
    description: developer.description,
    coverage: developer.coverage,
    projectCount,
    status: developer.publication_status,
    contactLinks: contacts
      .filter((contact) => contact.owner_type === "developer" && contact.developer_id === developer.id)
      .map(mapContact)
  };
}

function mapProject(project: ProjectRow, media?: ProjectImage[]): Project {
  const cover = media?.find((image) => image.id.startsWith("project_cover:")) ?? fallbackCover;
  const gallery = media?.filter((image) => image.id.startsWith("project_gallery:")) ?? [];
  const sdp = media?.find((image) => image.id.startsWith("project_sdp:")) ?? fallbackSdp;

  return {
    id: project.id,
    developerId: project.developer_id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    location: project.location,
    projectType: project.project_type,
    statusLabel: project.status_label ?? undefined,
    priceRange: project.price_range ?? undefined,
    totalLotsAvailable: project.total_lots_available ?? undefined,
    levels: project.levels ?? undefined,
    lotSizeRange: project.lot_size_range ?? undefined,
    completionLabel: project.completion_label ?? undefined,
    mapAddress: project.map_address ?? undefined,
    totalSiteArea: project.total_site_area ?? undefined,
    roadReserve: project.road_reserve ?? undefined,
    commonZones: project.common_zones ?? undefined,
    zoning: project.zoning ?? undefined,
    sdpReference: project.sdp_reference ?? undefined,
    coverImage: cover,
    gallery,
    sdpImage: sdp,
    googleMapsUrl: project.google_maps_url ?? "https://maps.google.com",
    publicationStatus: project.publication_status
  };
}

function mapContact(contact: ContactRow): ContactLink {
  return {
    id: contact.id,
    type: contact.type,
    label: contact.label,
    value: contact.value,
    href: contact.href,
    isEnabled: contact.is_enabled
  };
}
