"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterFacets {
  categories: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
  colors: { name: string; hex: string }[];
}

function useFilterParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // reset pagination on any filter change
    router.push(`${pathname}?${params.toString()}`);
  };
}

function FilterGroups({ facets }: { facets: FilterFacets }) {
  const searchParams = useSearchParams();
  const setParam = useFilterParam();

  const activeCategory = searchParams.get("category");
  const activeCollection = searchParams.get("collection");
  const activeColor = searchParams.get("color");

  return (
    <div className="space-y-8">
      <FilterGroup title="Category">
        {facets.categories.map((c) => (
          <FilterCheckbox
            key={c.slug}
            label={c.name}
            checked={activeCategory === c.slug}
            onChange={(checked) => setParam("category", checked ? c.slug : null)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Collection">
        {facets.collections.map((c) => (
          <FilterCheckbox
            key={c.slug}
            label={c.name}
            checked={activeCollection === c.slug}
            onChange={(checked) => setParam("collection", checked ? c.slug : null)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {facets.colors.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => setParam("color", activeColor === c.name ? null : c.name)}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                activeColor === c.name ? "scale-110 border-gold" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <FilterCheckbox
          label="In stock only"
          checked={searchParams.get("inStock") === "true"}
          onChange={(checked) => setParam("inStock", checked ? "true" : null)}
        />
        <FilterCheckbox
          label="New arrivals"
          checked={searchParams.get("newArrival") === "true"}
          onChange={(checked) => setParam("newArrival", checked ? "true" : null)}
        />
        <FilterCheckbox
          label="Featured"
          checked={searchParams.get("featured") === "true"}
          onChange={(checked) => setParam("featured", checked ? "true" : null)}
        />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm text-navy">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-navy/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-gold"
      />
      {label}
    </label>
  );
}

export function ShopFiltersDesktop({ facets }: { facets: FilterFacets }) {
  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <FilterGroups facets={facets} />
    </aside>
  );
}

export function ShopFiltersMobile({ facets }: { facets: FilterFacets }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-navy/20 px-4 py-2 text-sm text-navy"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/40" onClick={() => setOpen(false)}>
          <div
            className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-cream p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg text-navy">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5 text-navy" />
              </button>
            </div>
            <FilterGroups facets={facets} />
            <button
              onClick={() => setOpen(false)}
              className="mt-8 w-full bg-navy py-3 text-sm text-cream"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
