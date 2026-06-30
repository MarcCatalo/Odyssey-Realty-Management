import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppError } from "@/server/errors";
import type { ContactType } from "@/features/catalog/types";
import type { UpdateRealtorProfileInput } from "@/server/validators/realtor-profile";

type SupabaseAdminClient = NonNullable<ReturnType<typeof createServerSupabaseClient>>;

function getAdminClient(): SupabaseAdminClient {
  const client = createServerSupabaseClient();

  if (!client) {
    throw new AppError("Supabase is not configured for server requests.", 503);
  }

  return client;
}

export async function updateRealtorProfile({
  input,
  realtorId
}: {
  input: UpdateRealtorProfileInput;
  realtorId: string;
}) {
  const client = getAdminClient();
  const { error: realtorError } = await client
    .from("realtors")
    .update({
      business_name: input.businessName,
      title: input.title
    })
    .eq("id", realtorId);

  if (realtorError) {
    throw new AppError("Realtor profile details could not be saved.");
  }

  const { error: settingsError } = await client.from("realtor_catalog_settings").upsert(
    {
      realtor_id: realtorId,
      sidebar_brand_name: input.businessName,
      header_main: input.headerMain,
      header_primary_subheader: input.headerPrimarySubheader,
      header_secondary_subheader: input.headerSecondarySubheader
    },
    { onConflict: "realtor_id" }
  );

  if (settingsError) {
    throw new AppError("Website header details could not be saved.");
  }

  const { error: deleteContactsError } = await client
    .from("contact_links")
    .delete()
    .eq("realtor_id", realtorId)
    .eq("owner_type", "realtor");

  if (deleteContactsError) {
    throw new AppError("Realtor contact details could not be saved.");
  }

  const contactRows = buildContactRows(input, realtorId);
  const { error: contactsError } = await client.from("contact_links").insert(contactRows);

  if (contactsError) {
    throw new AppError("Realtor contact details could not be saved.");
  }

  return {
    businessName: input.businessName,
    headerMain: input.headerMain
  };
}

function buildContactRows(input: UpdateRealtorProfileInput, realtorId: string) {
  const rows: Array<{
    href: string;
    is_enabled: boolean;
    label: string;
    owner_type: "realtor";
    realtor_id: string;
    sort_order: number;
    type: ContactType;
    value: string;
  }> = [
    {
      href: `tel:${input.phone.replace(/[^\d+]/g, "")}`,
      is_enabled: true,
      label: "Call sales agent",
      owner_type: "realtor" as const,
      realtor_id: realtorId,
      sort_order: 0,
      type: "phone" as const,
      value: input.phone
    },
    {
      href: `mailto:${input.email}`,
      is_enabled: true,
      label: "Email sales agent",
      owner_type: "realtor" as const,
      realtor_id: realtorId,
      sort_order: 1,
      type: "email" as const,
      value: input.email
    }
  ];
  const socialDefinitions = [
    { label: "Facebook page", sortOrder: 2, type: "facebook" as const, value: input.socials.facebook },
    { label: "Instagram", sortOrder: 3, type: "instagram" as const, value: input.socials.instagram },
    { label: "LinkedIn", sortOrder: 4, type: "linkedin" as const, value: input.socials.linkedin },
    { label: "Website", sortOrder: 5, type: "website" as const, value: input.socials.website }
  ];

  socialDefinitions.forEach((social) => {
    if (!social.value) {
      return;
    }

    rows.push({
      href: social.value,
      is_enabled: true,
      label: social.label,
      owner_type: "realtor",
      realtor_id: realtorId,
      sort_order: social.sortOrder,
      type: social.type,
      value: social.value
    });
  });

  return rows;
}
