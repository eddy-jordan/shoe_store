import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=80",
    alt: "Sneakers dangling above a city street",
  },
  {
    src: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&q=80",
    alt: "White sneaker mid-stride on a city road",
  },
  {
    src: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1600&q=80",
    alt: "Sneakers dramatically lit against a dark background",
  },
];

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <HeroSlideshow slides={HERO_SLIDES} intervalMs={5000} parallaxSpeed={0.25} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end gap-6 px-4 pb-16 sm:px-6">
          <h1 className="max-w-xl text-5xl font-bold tracking-tight text-white">
            Shoes built to move.
          </h1>
          <p className="max-w-md text-lg text-zinc-200">
            Sneakers, running shoes, and boots designed for every stride.
          </p>
          <Link
            href="/products"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">New arrivals</h2>
            <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              View all &rarr;
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 80}>
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
      </section>
    </div>
  );
}
