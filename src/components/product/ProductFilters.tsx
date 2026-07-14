import Link from "next/link";

interface ProductFiltersProps {
  categories: { name: string; slug: string }[];
  sizes: string[];
  selectedCategory?: string;
  selectedSize?: string;
}

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/products?${query}` : "/products";
}

function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
      }`}
    >
      {children}
    </Link>
  );
}

export function ProductFilters({ categories, sizes, selectedCategory, selectedSize }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <FilterPill href={buildHref({ size: selectedSize })} active={!selectedCategory}>
          All
        </FilterPill>
        {categories.map((category) => (
          <FilterPill
            key={category.slug}
            href={buildHref({
              category: selectedCategory === category.slug ? undefined : category.slug,
              size: selectedSize,
            })}
            active={selectedCategory === category.slug}
          >
            {category.name}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <FilterPill
            key={size}
            href={buildHref({
              category: selectedCategory,
              size: selectedSize === size ? undefined : size,
            })}
            active={selectedSize === size}
          >
            EU {size}
          </FilterPill>
        ))}
      </div>
    </div>
  );
}
