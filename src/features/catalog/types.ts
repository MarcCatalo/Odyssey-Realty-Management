export type PublicationStatus = "draft" | "published" | "archived";

export type ContactType =
  | "phone"
  | "email"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "messenger"
  | "whatsapp"
  | "viber"
  | "website"
  | "custom";

export type ContactLink = {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  href: string;
  isEnabled: boolean;
};

export type SalesAgent = {
  businessLabel: string;
  catalogSlug: string;
  headerMain: string;
  headerPrimarySubheader: string;
  headerSecondarySubheader: string;
  name: string;
  profileImage?: ProjectImage;
  socials: ContactLink[];
  title: string;
  summary: string;
  contactLinks: ContactLink[];
};

export type Developer = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  description: string;
  coverage: string;
  projectCount: number;
  status: PublicationStatus;
  contactLinks: ContactLink[];
  logoImage?: ProjectImage;
};

export type ProjectImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  id: string;
  developerId: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  projectType: string;
  statusLabel?: string;
  priceRange?: string;
  totalLotsAvailable?: number;
  levels?: string;
  lotSizeRange?: string;
  completionLabel?: string;
  featuresAmenities: string[];
  mapAddress?: string;
  totalSiteArea?: string;
  roadReserve?: string;
  commonZones?: string;
  zoning?: string;
  sdpReference?: string;
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  sdpImage: ProjectImage;
  googleMapsUrl: string;
  publicationStatus: PublicationStatus;
};

export type PublicContactBundle = {
  owner: "sales-agent" | "developer";
  name: string;
  links: ContactLink[];
};
