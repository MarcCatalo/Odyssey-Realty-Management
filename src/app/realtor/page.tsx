import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  Home,
  Mail,
  Plus,
  ShieldCheck,
  UsersRound
} from "lucide-react";

import { developers, projects, salesAgent } from "@/features/catalog/data";

const publishedDevelopers = developers.filter((developer) => developer.status === "published");
const publishedProjects = projects.filter((project) => project.publicationStatus === "published");

const quickActions = [
  {
    title: "Manage developers",
    description: "Update developer profiles, contact links, coverage, and public visibility.",
    href: "/realtor/developers",
    icon: UsersRound,
    cta: "Open developers"
  },
  {
    title: "Add new developer",
    description: "Start a developer profile and prepare it for public publishing.",
    href: "/realtor/developers/new",
    icon: Plus,
    cta: "Create developer"
  },
  {
    title: "Add new project",
    description: "Create a project page and choose which developer owns it.",
    href: "/realtor/projects/new",
    icon: Home,
    cta: "Create project"
  },
  {
    title: "Contact profile",
    description: "Manage the default sales-agent contact details used on public pages.",
    href: "/realtor/contact",
    icon: Mail,
    cta: "Edit contact"
  }
];

export default function RealtorDashboardPage() {
  return (
    <>
      <section className="realtor-hero">
        <div className="realtor-hero-grid mx-auto max-w-7xl">
          <div className="realtor-hero-copy reveal">
            <p className="realtor-hero-eyebrow">Catalog manager</p>
            <h1>Realtor dashboard</h1>
              <p>
              Manage published developers, project previews, media, and sales-agent contact
              details for your public catalog.
            </p>
          </div>

          <aside className="realtor-hero-aside reveal reveal-delay-1">
            <div className="realtor-status-card lift-card">
              <ShieldCheck aria-hidden="true" className="h-8 w-8" />
              <h2>Public catalog active</h2>
              <p>Visitors can browse your published developers and projects.</p>
            </div>
            <Link className="realtor-preview-button" href="/" target="_blank">
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview public catalog
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="realtor-stat-strip">
        <div className="realtor-stat-grid mx-auto max-w-7xl">
          <DashboardStat icon={Building2} label="Published developers" value={`${publishedDevelopers.length}`} />
          <DashboardStat icon={UsersRound} label="Developer limit" value="4 / 10" />
          <DashboardStat icon={Building2} label="Published projects" value={`${publishedProjects.length}`} />
          <DashboardStat icon={Mail} label="Default contact" value={salesAgent.name} />
        </div>
      </section>

      <section className="realtor-dashboard-section scroll-reveal px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="realtor-section-heading">
            <h2>Catalog actions</h2>
            <span aria-hidden="true" />
          </div>

          <div className="realtor-action-grid stagger-list">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <article className="realtor-action-card interactive-card reveal scroll-reveal" key={action.title}>
                  <Link className="flex h-full flex-col focus:outline-none" href={action.href} prefetch>
                    <div className="realtor-action-icon">
                      <Icon aria-hidden="true" className="h-7 w-7" />
                    </div>
                    <div className="realtor-action-body">
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>
                    <div className="realtor-action-footer">
                      <span>{action.cta}</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="realtor-dashboard-section scroll-reveal border-t-[3px] border-canopy px-5 py-10 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="realtor-panel reveal">
            <p className="realtor-panel-kicker">Subscription usage</p>
            <h2>Pro catalog</h2>
            <UsageRow label="Developers" value="4 of 10 published" percent="40%" />
            <UsageRow label="Projects" value="2 of 100 published" percent="2%" />
            <UsageRow label="Media storage" value="18 MB of 500 MB used" percent="4%" />
          </div>

          <div className="realtor-panel reveal reveal-delay-1">
            <p className="realtor-panel-kicker">Recent activity</p>
            <h2>Latest updates</h2>
            <div className="realtor-activity-list">
              <ActivityItem title="PrimeBuild Homes updated" meta="Developer profile checked today" />
              <ActivityItem title="Greenridge Villas published" meta="Project page available on public catalog" />
              <ActivityItem title="Media review needed" meta="Northline Terraces has no interior gallery yet" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DashboardStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="realtor-stat-item reveal">
      <Icon aria-hidden="true" className="realtor-stat-icon" />
      <div>
        <p className="realtor-stat-value">{value}</p>
        <p className="realtor-stat-label">{label}</p>
      </div>
    </div>
  );
}

function UsageRow({ label, value, percent }: { label: string; value: string; percent: string }) {
  return (
    <div className="realtor-usage-row">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="realtor-usage-track">
        <span style={{ width: percent }} />
      </div>
    </div>
  );
}

function ActivityItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="realtor-activity-item">
      <p>{title}</p>
      <span>{meta}</span>
    </div>
  );
}
