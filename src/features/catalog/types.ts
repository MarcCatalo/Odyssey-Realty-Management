export type PublicationStatus = "draft" | "published" | "archived";

export type ContactType =
  | "phone"
  | "email"
  | "facebook"
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
  name: string;
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
