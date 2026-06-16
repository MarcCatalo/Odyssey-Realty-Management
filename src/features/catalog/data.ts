import type { Developer, Project, SalesAgent } from "./types";

export const salesAgent: SalesAgent = {
  name: "Meridian Realty Partners",
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
    priceRange: "Price available through sales agent",
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
