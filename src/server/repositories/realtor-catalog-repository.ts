import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppError } from "@/server/errors";
import type { CreateDeveloperInput } from "@/server/validators/realtor-developer";
import type { CreateProjectInput } from "@/server/validators/realtor-project";

type SupabaseAdminClient = NonNullable<ReturnType<typeof createServerSupabaseClient>>;

function getAdminClient(): SupabaseAdminClient {
  const client = createServerSupabaseClient();

  if (!client) {
    throw new AppError("Supabase is not configured for server requests.", 503);
  }

  return client;
}

export async function getDeveloperSlugs(realtorId: string) {
  const client = getAdminClient();
  const { data, error } = await client.from("developers").select("slug").eq("realtor_id", realtorId);

  if (error) {
    throw new AppError("Developer slugs could not be checked.");
  }

  return (data ?? []).map((developer) => developer.slug as string);
}

export async function getProjectSlugs(developerId: string) {
  const client = getAdminClient();
  const { data, error } = await client.from("projects").select("slug").eq("developer_id", developerId);

  if (error) {
    throw new AppError("Project slugs could not be checked.");
  }

  return (data ?? []).map((project) => project.slug as string);
}

export async function countDevelopers(realtorId: string) {
  const client = getAdminClient();
  const { count, error } = await client
    .from("developers")
    .select("id", { count: "exact", head: true })
    .eq("realtor_id", realtorId)
    .neq("publication_status", "archived");

  if (error) {
    throw new AppError("Developer allowance could not be checked.");
  }

  return count ?? 0;
}

export async function countProjectsForDeveloper(developerId: string) {
  const client = getAdminClient();
  const { count, error } = await client
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("developer_id", developerId)
    .neq("publication_status", "archived");

  if (error) {
    throw new AppError("Project allowance could not be checked.");
  }

  return count ?? 0;
}

export async function countProjectImages(projectId: string) {
  const client = getAdminClient();
  const { count, error } = await client
    .from("project_media")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (error) {
    throw new AppError("Project image allowance could not be checked.");
  }

  return count ?? 0;
}

export async function projectHasMediaRole(
  projectId: string,
  role: "project_cover" | "project_gallery" | "project_sdp"
) {
  const client = getAdminClient();
  const { count, error } = await client
    .from("project_media")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("role", role);

  if (error) {
    throw new AppError("Project media could not be checked.");
  }

  return (count ?? 0) > 0;
}

export async function findDeveloperBySlug(realtorId: string, slug: string) {
  const client = getAdminClient();
  const { data, error } = await client
    .from("developers")
    .select("id,name,slug")
    .eq("realtor_id", realtorId)
    .eq("slug", slug)
    .neq("publication_status", "archived")
    .maybeSingle();

  if (error) {
    throw new AppError("Developer could not be loaded.");
  }

  return data;
}

export async function findProjectForRealtor(realtorId: string, projectId: string) {
  const client = getAdminClient();
  const { data, error } = await client
    .from("projects")
    .select("id,realtor_id,developer_id,title")
    .eq("id", projectId)
    .eq("realtor_id", realtorId)
    .neq("publication_status", "archived")
    .maybeSingle();

  if (error) {
    throw new AppError("Project could not be loaded.");
  }

  return data;
}

export async function insertDeveloper({
  input,
  realtorId,
  slug
}: {
  input: CreateDeveloperInput;
  realtorId: string;
  slug: string;
}) {
  const client = getAdminClient();
  const { data, error } = await client
    .from("developers")
    .insert({
      realtor_id: realtorId,
      name: input.name,
      slug,
      specialty: input.specialty,
      coverage: input.coverage,
      description: input.description,
      publication_status: input.publicationStatus
    })
    .select("id,name,slug,publication_status")
    .single();

  if (error) {
    throw new AppError("Developer could not be created.");
  }

  return data;
}

export async function insertProject({
  developerId,
  input,
  realtorId,
  slug
}: {
  developerId: string;
  input: CreateProjectInput;
  realtorId: string;
  slug: string;
}) {
  const client = getAdminClient();
  const { data, error } = await client
    .from("projects")
    .insert({
      realtor_id: realtorId,
      developer_id: developerId,
      title: input.title,
      slug,
      description: input.description,
      location: input.location,
      project_type: input.projectType,
      status_label: input.statusLabel,
      price_range: input.priceRange,
      total_lots_available: input.totalLotsAvailable ?? null,
      levels: input.levels,
      lot_size_range: input.lotSizeRange,
      completion_label: input.completionLabel,
      map_address: input.mapAddress,
      google_maps_url: input.googleMapsUrl,
      total_site_area: input.totalSiteArea,
      road_reserve: input.roadReserve,
      common_zones: input.commonZones,
      zoning: input.zoning,
      sdp_reference: input.sdpReference,
      publication_status: input.publicationStatus
    })
    .select("id,title,slug,developer_id,publication_status")
    .single();

  if (error) {
    throw new AppError("Project could not be created.");
  }

  return data;
}

export async function insertMediaAsset({
  altText,
  bucket,
  caption,
  fileSizeBytes,
  height,
  mimeType,
  originalFilename,
  realtorId,
  storagePath,
  width
}: {
  altText?: string;
  bucket: string;
  caption?: string;
  fileSizeBytes: number;
  height?: number;
  mimeType: string;
  originalFilename: string;
  realtorId: string;
  storagePath: string;
  width?: number;
}) {
  const client = getAdminClient();
  const { data, error } = await client
    .from("media_assets")
    .insert({
      realtor_id: realtorId,
      bucket,
      storage_path: storagePath,
      original_filename: originalFilename,
      mime_type: mimeType,
      file_size_bytes: fileSizeBytes,
      width: width ?? null,
      height: height ?? null,
      alt_text: altText ?? null,
      caption: caption ?? null
    })
    .select("id,storage_path,mime_type,file_size_bytes,width,height")
    .single();

  if (error) {
    throw new AppError("Media metadata could not be saved.");
  }

  return data;
}

export async function attachProjectMedia({
  altText,
  caption,
  mediaAssetId,
  projectId,
  role
}: {
  altText?: string;
  caption?: string;
  mediaAssetId: string;
  projectId: string;
  role: "project_cover" | "project_gallery" | "project_sdp";
}) {
  const client = getAdminClient();

  if (role === "project_cover" || role === "project_sdp") {
    await client.from("project_media").delete().eq("project_id", projectId).eq("role", role);
  }

  const { data, error } = await client
    .from("project_media")
    .insert({
      project_id: projectId,
      media_asset_id: mediaAssetId,
      role,
      caption: caption ?? null,
      alt_text: altText ?? null
    })
    .select("id,project_id,media_asset_id,role")
    .single();

  if (error) {
    throw new AppError("Media could not be attached to the project.");
  }

  return data;
}

export async function uploadObject({
  contentType,
  data,
  path
}: {
  contentType: string;
  data: Buffer;
  path: string;
}) {
  const client = getAdminClient();
  const { error } = await client.storage.from("realtor-media").upload(path, data, {
    contentType,
    upsert: false
  });

  if (error) {
    throw new AppError("Image could not be uploaded.");
  }
}
