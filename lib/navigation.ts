export type NavItem = {
  id: string;
  label: string;
  href: string;
  match?: "exact" | "prefix";
  description?: string;
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  keywords: string[];
};

export const PRIMARY_NAV: NavItem[] = [
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    match: "prefix",
    description: "Curated problems",
  },
  {
    id: "spaces",
    label: "Spaces",
    href: "/search?tab=spaces",
    match: "prefix",
    description: "Solution spaces",
  },
  {
    id: "search",
    label: "Search",
    href: "/search",
    match: "prefix",
    description: "Global discovery",
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile/me",
    match: "prefix",
    description: "Research identity",
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-search",
    label: "Open Search",
    description: "Search the research graph",
    href: "/search",
    keywords: ["search", "discover", "graph"],
  },
  {
    id: "qa-create-problem",
    label: "Create Problem (placeholder)",
    description: "UI-only MVP entry point",
    href: "/explore",
    keywords: ["create", "problem", "new"],
  },
  {
    id: "qa-create-space",
    label: "Create Space (placeholder)",
    description: "UI-only MVP entry point",
    href: "/search?tab=spaces",
    keywords: ["create", "space", "workspace"],
  },
  {
    id: "qa-onboarding",
    label: "Onboarding",
    description: "Configure domains and intent",
    href: "/onboarding",
    keywords: ["onboarding", "domains", "interests"],
  },
];

export type BreadcrumbItem = {
  label: string;
  href: string;
};

function clean(segment: string) {
  return segment.replace(/\?.*$/, "").replace(/#.*/, "");
}

function titleCase(text: string) {
  return text
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isNumericId(segment: string) {
  return /^\d+$/.test(segment);
}

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const path = clean(pathname);
  const parts = path.split("/").filter(Boolean);

  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  if (parts.length === 0) return crumbs;

  // Root mappings
  const root = parts[0];
  if (root === "explore") {
    crumbs.push({ label: "Explore", href: "/explore" });
    return crumbs;
  }

  if (root === "search") {
    crumbs.push({ label: "Search", href: "/search" });
    return crumbs;
  }

  if (root === "auth") {
    crumbs.push({ label: "Access", href: "/auth/sign-in" });
    if (parts[1] === "sign-up") crumbs.push({ label: "Sign up", href: "/auth/sign-up" });
    if (parts[1] === "sign-in") crumbs.push({ label: "Sign in", href: "/auth/sign-in" });
    return crumbs;
  }

  if (root === "onboarding") {
    crumbs.push({ label: "Onboarding", href: "/onboarding" });
    return crumbs;
  }

  if (root === "problems") {
    crumbs.push({ label: "Problems", href: "/explore" });
    const id = parts[1];
    if (id) {
      crumbs.push({ label: isNumericId(id) ? `Problem #${id}` : titleCase(id), href: `/problems/${id}` });
    }
    return crumbs;
  }

  if (root === "spaces") {
    crumbs.push({ label: "Spaces", href: "/search?tab=spaces" });
    const id = parts[1];
    if (id) {
      crumbs.push({ label: isNumericId(id) ? `Space #${id}` : titleCase(id), href: `/spaces/${id}` });
    }
    return crumbs;
  }

  if (root === "profile") {
    crumbs.push({ label: "Profiles", href: "/search?tab=researchers" });
    const id = parts[1];
    if (id) {
      crumbs.push({ label: id === "me" ? "You" : titleCase(id), href: `/profile/${id}` });
    }
    return crumbs;
  }

  crumbs.push({ label: titleCase(root), href: `/${root}` });
  return crumbs;
}

export function isActivePath({
  pathname,
  item,
}: {
  pathname: string;
  item: NavItem;
}) {
  const hrefPath = item.href.split("?")[0] ?? item.href;
  if (item.match === "exact") return pathname === hrefPath;
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}
