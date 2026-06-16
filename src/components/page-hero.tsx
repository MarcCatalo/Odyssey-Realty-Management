import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div
        className={`page-hero-grid mx-auto grid max-w-7xl gap-10 ${
          children ? "page-hero-grid-with-aside md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.46fr)]" : ""
        }`}
      >
        <div className="page-hero-copy reveal">
          <p className="page-hero-eyebrow">{eyebrow}</p>
          <h1 className="page-hero-title">{title}</h1>
          <p className="page-hero-description">{description}</p>
        </div>
        {children ? <div className="page-hero-aside reveal reveal-delay-1">{children}</div> : null}
      </div>
    </section>
  );
}
