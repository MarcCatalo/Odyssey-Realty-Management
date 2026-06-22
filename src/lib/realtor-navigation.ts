import { publishCatalogUpdate } from "@/lib/catalog-update-signal";

type MutationRouter = {
  push: (href: string) => void;
  refresh: () => void;
};

export function refreshAfterMutation(router: MutationRouter, href?: string) {
  publishCatalogUpdate();

  if (href) {
    router.push(href);
  } else {
    router.refresh();
  }

  window.setTimeout(() => {
    router.refresh();
  }, 0);
}
