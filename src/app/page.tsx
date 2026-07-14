import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
          <h1 className="max-w-xl text-5xl font-bold tracking-tight text-zinc-900">
            Shoes built to move.
          </h1>
          <p className="max-w-md text-lg text-zinc-600">
            Sneakers, running shoes, and boots designed for every stride.
          </p>
          <Link
            href="/products"
            className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">New arrivals</h2>
          <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              priceKobo={product.priceKobo}
              imageUrl={product.imageUrl}
              inStock={product.variants.some((v) => v.stock > 0)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
