import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";

import type { ContactLink } from "@/features/catalog/types";

const iconMap = {
  phone: Phone,
  email: Mail,
  facebook: MessageCircle,
  instagram: MessageCircle,
  linkedin: MessageCircle,
  messenger: MessageCircle,
  whatsapp: MessageCircle,
  viber: MessageCircle,
  website: ExternalLink,
  custom: ExternalLink
};

type ContactActionsProps = {
  links: ContactLink[];
  compact?: boolean;
};

export function ContactActions({ links, compact = false }: ContactActionsProps) {
  const enabledLinks = links.filter((link) => link.isEnabled);

  if (enabledLinks.length === 0) {
    return null;
  }

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>
      {enabledLinks.map((link) => {
        const Icon = iconMap[link.type];

        return (
          <a
            className="brutal-link flex items-center justify-center gap-2 px-3 py-2 text-xs"
            href={link.href}
            key={link.id}
            rel="noreferrer"
            target={link.href.startsWith("http") ? "_blank" : undefined}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
