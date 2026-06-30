import type { Developer, Project, SalesAgent } from "./types";

export const salesAgent: SalesAgent = {
  businessLabel: "Meridian Realty",
  catalogSlug: "meridian-group",
  headerMain: "Developer Catalog",
  headerPrimarySubheader: "Agent-curated. Not a marketplace.",
  headerSecondarySubheader:
    "Browse vetted developer partners, available project previews, house galleries, site development plans, and sales-agent contact paths in one managed catalog.",
  name: "Meridian Realty Partners",
  profileImage: undefined,
  socials: [
    {
      id: "agent-facebook",
      type: "facebook",
      label: "Facebook page",
      value: "Meridian Realty",
      href: "https://facebook.com",
      isEnabled: true
    },
    {
      id: "agent-instagram",
      type: "custom",
      label: "Instagram",
      value: "@meridianrealty",
      href: "https://instagram.com",
      isEnabled: true
    },
    {
      id: "agent-linkedin",
      type: "custom",
      label: "LinkedIn",
      value: "Meridian Realty",
      href: "https://linkedin.com",
      isEnabled: true
    }
  ],
  title: "Sales Agent Network",
  summary:
    "A curated sales desk for comparing developer-backed homes, subdivisions, and mixed real estate projects.",
  contactLinks: [
    {
      id: "agent-phone",
      type: "phone",
      label: "Call sales desk",
      value: "+63 917 000 0000",
      href: "tel:+639170000000",
      isEnabled: true
    },
    {
      id: "agent-email",
      type: "email",
      label: "Email sales desk",
      value: "sales@example.com",
      href: "mailto:sales@example.com",
      isEnabled: true
    },
    {
      id: "agent-facebook",
      type: "facebook",
      label: "Facebook page",
      value: "Meridian Realty",
      href: "https://facebook.com",
      isEnabled: true
    }
  ]
};

export const developers: Developer[] = [
  {
    id: "dev-primebuild",
    name: "PrimeBuild Homes",
    slug: "primebuild-homes",
    specialty: "House and lot communities",
    description:
      "Focused on practical family homes with clear subdivision planning, move-in-ready packages, and steady project turnover.",
    coverage: "Quezon City, Metro Manila",
    projectCount: 3,
    status: "published",
    contactLinks: [
      {
        id: "primebuild-website",
        type: "website",
        label: "Developer site",
        value: "primebuild.example",
        href: "https://example.com",
        isEnabled: true
      }
    ]
  },
  {
    id: "dev-dreamworks",
    name: "DreamWorks Builders",
    slug: "dreamworks-builders",
    specialty: "Townhouses and compact lots",
    description:
      "Builds compact townhouse clusters for buyers who want predictable layouts near active city corridors.",
    coverage: "Cavite and Laguna",
    projectCount: 2,
    status: "published",
    contactLinks: []
  },
  {
    id: "dev-elevate",
    name: "Elevate Construction",
    slug: "elevate-construction",
    specialty: "Mixed residential projects",
    description:
      "Offers a flexible portfolio of duplex, townhouse, and low-rise residential projects across growth locations.",
    coverage: "Laguna, Batangas",
    projectCount: 4,
    status: "published",
    contactLinks: []
  },
  {
    id: "dev-solid",
    name: "Solid Foundations",
    slug: "solid-foundations",
    specialty: "Starter homes",
    description:
      "Produces straightforward starter home projects with clear turnover expectations and accessible locations.",
    coverage: "Bulacan, Pampanga",
    projectCount: 2,
    status: "published",
    contactLinks: []
  }
];

const placeholder = (id: string, caption: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

export const projects: Project[] = [
  {
    id: "proj-greenridge",
    developerId: "dev-primebuild",
    title: "Greenridge Villas",
    slug: "greenridge-villas",
    description:
      "A quiet house-and-lot enclave with practical two-storey layouts, pocket green space, and direct access to nearby retail corridors.",
    location: "Quezon City, Metro Manila",
    projectType: "House and lot",
    statusLabel: "Pre-selling",
    priceRange: "From PHP 5.8M",
    totalLotsAvailable: 18,
    levels: "2",
    lotSizeRange: "180-220 m²",
    completionLabel: "Q3 2026",
    featuresAmenities: [
      "Clubhouse",
      "Landscaped open spaces",
      "24/7 security",
      "Children's play area"
    ],
    mapAddress: "42 Greenridge Drive, Quezon City, Metro Manila",
    totalSiteArea: "6,240 m²",
    roadReserve: "Included",
    commonZones: "2",
    zoning: "R3 Medium Density",
    sdpReference: "DA-2024-0847",
    coverImage: {
      id: "greenridge-cover",
      src: placeholder("1600585154340-be6161a56a0c", "Modern house exterior"),
      alt: "Modern two-storey house exterior",
      caption: "Exterior view"
    },
    gallery: [
      {
        id: "greenridge-gallery-1",
        src: placeholder("1600607687939-ce8a6c25118c", "Living area interior"),
        alt: "Bright open-plan living area",
        caption: "Living area"
      },
      {
        id: "greenridge-gallery-2",
        src: placeholder("1600566753190-17f0baa2a6c3", "Kitchen interior"),
        alt: "Compact modern kitchen",
        caption: "Kitchen"
      },
      {
        id: "greenridge-gallery-3",
        src: placeholder("1600210492486-724fe5c67fb0", "Primary bedroom interior"),
        alt: "Primary bedroom with natural light",
        caption: "Primary bedroom"
      },
      {
        id: "greenridge-gallery-4",
        src: placeholder("1600566752355-35792bedcfea", "Bathroom interior"),
        alt: "Modern bathroom with clean fixtures",
        caption: "Bathroom"
      },
      {
        id: "greenridge-gallery-5",
        src: placeholder("1600607687644-c7171b42498b", "Dining area interior"),
        alt: "Dining area connected to the living room",
        caption: "Dining area"
      },
      {
        id: "greenridge-gallery-6",
        src: placeholder("1600566752229-250ed79470c1", "Outdoor patio area"),
        alt: "Outdoor patio and garden space",
        caption: "Patio"
      },
      {
        id: "greenridge-gallery-7",
        src: placeholder("1600607687920-4e2a09cf159d", "Second floor landing"),
        alt: "Second floor landing with bright hallway",
        caption: "Second floor"
      }
    ],
    sdpImage: {
      id: "greenridge-sdp",
      src: placeholder("1500530855697-b586d89ba3ee", "Subdivision plan reference"),
      alt: "Site development plan reference image",
      caption: "Site development plan"
    },
    googleMapsUrl: "https://maps.google.com",
    publicationStatus: "published"
  },
  {
    id: "proj-northline",
    developerId: "dev-primebuild",
    title: "Northline Terraces",
    slug: "northline-terraces",
    description:
      "A townhouse collection designed for buyers who want a compact footprint, secure access, and a developer-backed turnover path.",
    location: "Caloocan, Metro Manila",
    projectType: "Townhouse",
    statusLabel: "Ready for viewing",
    priceRange: "From PHP 4.2M",
    totalLotsAvailable: 9,
    levels: "3",
    lotSizeRange: "96-140 m²",
    completionLabel: "Ready for viewing",
    featuresAmenities: ["Gated entrance", "24/7 security", "Community open space"],
    mapAddress: "18 Northline Avenue, Caloocan, Metro Manila",
    totalSiteArea: "3,480 m²",
    roadReserve: "Included",
    commonZones: "1",
    zoning: "Townhouse cluster",
    sdpReference: "Block plan",
    coverImage: {
      id: "northline-cover",
      src: placeholder("1605276374104-dee2a0ed3cd6", "Townhouse facade"),
      alt: "Townhouse facade with clean lines",
      caption: "Street frontage"
    },
    gallery: [],
    sdpImage: {
      id: "northline-sdp",
      src: placeholder("1494526585095-c41746248156", "Area planning reference"),
      alt: "Area planning reference",
      caption: "Block plan"
    },
    googleMapsUrl: "https://maps.google.com",
    publicationStatus: "published"
  }
];
