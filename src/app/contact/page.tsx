import Image from "next/image";
import { AtSign, Mail, Phone, UserRound } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { getPublicCatalog } from "@/features/catalog/live-queries";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { salesAgent } = await getPublicCatalog();
  const directContactLinks = salesAgent.contactLinks.filter((link) =>
    ["email", "phone", "website"].includes(link.type)
  );

  return (
    <>
      <PageHero
        description="Public project inquiries are routed to the sales agent by default. Developer contact details stay limited to developer cards and profiles."
        eyebrow="Contact"
        title="Contact sales"
      />
      <section className="reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="contact-profile-panel reveal mx-auto max-w-5xl">
          <div className="contact-profile-card">
            <div className="contact-profile-photo">
              {salesAgent.profileImage ? (
                <Image
                  alt={salesAgent.profileImage.alt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 12rem, 8rem"
                  src={salesAgent.profileImage.src}
                />
              ) : (
                <>
                  <UserRound aria-hidden="true" className="h-8 w-8" />
                  <strong>{getInitials(salesAgent.name)}</strong>
                </>
              )}
            </div>
            <div>
              <p>Realtor contact</p>
              <h2>{salesAgent.name}</h2>
              <span>{salesAgent.title}</span>
              <p className="contact-profile-summary">{salesAgent.summary}</p>
            </div>
          </div>

          <div className="contact-profile-details">
            <div className="contact-profile-socials">
              <p>Contact details</p>
              {directContactLinks.map((link) => (
                <a href={link.href} key={link.id} rel="noreferrer" target={link.href.startsWith("http") ? "_blank" : undefined}>
                  {link.type === "email" ? <Mail aria-hidden="true" className="h-4 w-4" /> : null}
                  {link.type === "phone" ? <Phone aria-hidden="true" className="h-4 w-4" /> : null}
                  {link.type !== "email" && link.type !== "phone" ? (
                    <AtSign aria-hidden="true" className="h-4 w-4" />
                  ) : null}
                  {link.label}: {link.value}
                </a>
              ))}
            </div>

            <div className="contact-profile-socials">
              <p>Socials</p>
              {salesAgent.socials.map((link) => (
                <a href={link.href} key={link.id} rel="noreferrer" target="_blank">
                  {link.type === "email" ? <Mail aria-hidden="true" className="h-4 w-4" /> : null}
                  {link.type === "phone" ? <Phone aria-hidden="true" className="h-4 w-4" /> : null}
                  {link.type !== "email" && link.type !== "phone" ? (
                    <AtSign aria-hidden="true" className="h-4 w-4" />
                  ) : null}
                  {link.label}: {link.value}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
