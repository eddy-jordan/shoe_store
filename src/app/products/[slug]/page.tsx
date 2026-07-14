import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { VariantSizePicker } from "@/components/product/VariantSizePicker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { variants: true, category: true },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {product.brand} &middot; {product.category.name}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{product.name}</h1>
        <p className="text-2xl font-semibold text-zinc-900">{formatNaira(product.priceKobo)}</p>
        <p className="leading-relaxed text-zinc-600">{product.description}</p>

        <div className="mt-4 border-t border-zinc-200 pt-6">
          <VariantSizePicker
            productId={product.id}
            slug={product.slug}
            name={product.name}
            imageUrl={product.imageUrl}
            priceKobo={product.priceKobo}
            variants={product.variants}
          />
        </div>
      </div>
    </div>
  );
}
