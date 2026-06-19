import { CheckCircle2 } from "lucide-react";

import { RealtorNewDeveloperForm } from "@/components/realtor-new-developer-form";

export default function NewDeveloperPage() {
  return (
    <>
      <section className="realtor-hero realtor-hero-compact">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">New developer</p>
            <h1>Add developer</h1>
            <p>
              Fill in the core public details first. Projects, gallery assets, and publishing checks can
              be added after this developer profile exists.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card lift-card">
              <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
              <h2>Choose visibility</h2>
              <p>Save the developer as a draft or publish it directly to the public catalog.</p>
            </div>
          </aside>
        </div>
      </section>

      <RealtorNewDeveloperForm />
    </>
  );
}
