import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function BreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb-bar" aria-label="Breadcrumb">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 md:px-10">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span className="inline-flex items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 ? <span className="breadcrumb-separator">&gt;</span> : null}
              {item.href && !isLast ? (
                <Link className="breadcrumb-link" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
