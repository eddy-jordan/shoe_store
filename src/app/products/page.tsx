import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const ALL_SIZES = ["40", "41", "42", "43", "44", "45"];

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; size?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, size } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(size ? { variants: { some: { size, stock: { gt: 0 } } } } : {}),
      },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Shop all shoes</h1>
      <p className="mt-1 text-zinc-500">{products.length} pairs found</p>

      <div className="mt-6">
        <ProductFilters
          categories={categories}
          sizes={ALL_SIZES}
          selectedCategory={category}
          selectedSize={size}
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500">No shoes match those filters yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={(index % 4) * 80}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                priceKobo={product.priceKobo}
                imageUrl={product.imageUrl}
                inStock={product.variants.some((v) => v.stock > 0)}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
