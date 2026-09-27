"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "name-asc": "Name: A–Z",
};

function setParam(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams>,
  key: string,
  value: string
) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) params.set(key, value);
  else params.delete(key);
  if (key !== "page") params.delete("page");
  router.push(`${pathname}?${params.toString()}`);
}

export function ShopSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <select
      value={searchParams.get("sort") ?? "featured"}
      onChange={(e) => setParam(router, pathname, searchParams, "sort", e.target.value)}
      className="border border-navy/20 bg-transparent px-4 py-2 text-sm text-navy"
    >
      {Object.entries(SORT_LABELS).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}

export function ShopSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-1 items-center gap-2 border-b border-navy/20 pb-2 sm:max-w-xs">
      <Search className="h-4 w-4 text-navy/50" />
      <input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Search fabrics, SKU, color..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setParam(router, pathname, searchParams, "q", (e.target as HTMLInputElement).value);
          }
        }}
        className="w-full bg-transparent text-sm outline-none placeholder:text-navy/40"
      />
    </div>
  );
}

export function ShopPagination({ page, pageCount }: { page: number; pageCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) return null;

  return (
    <div className="mt-16 flex justify-center gap-2">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setParam(router, pathname, searchParams, "page", String(p))}
          className={`h-9 w-9 text-sm ${p === page ? "bg-navy text-cream" : "text-navy/60 hover:text-navy"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
