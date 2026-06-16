import { ContactActions } from "@/components/contact-actions";
import { PageHero } from "@/components/page-hero";
import { salesAgent } from "@/features/catalog/data";

export default function ContactPage() {
  return (
    <>
      <PageHero
        description="Public project inquiries are routed to the sales agent by default. Developer contact details stay limited to developer cards and profiles."
        eyebrow="Contact"
        title="Contact sales"
      />
      <section className="reveal reveal-delay-1 px-5 py-10 md:px-10">
        <div className="brutal-panel reveal mx-auto max-w-3xl p-6">
          <p className="text-sm font-black text-grove">DEFAULT CONTACT SOURCE</p>
          <h2 className="mt-3 font-display text-4xl">{salesAgent.name}</h2>
          <p className="mt-4 text-lg leading-8">{salesAgent.summary}</p>
          <div className="mt-6">
            <ContactActions links={salesAgent.contactLinks} />
          </div>
        </div>
      </section>
    </>
  );
}
