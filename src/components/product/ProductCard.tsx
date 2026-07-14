import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  priceKobo: number;
  imageUrl: string;
  inStock: boolean;
}

export function ProductCard({ slug, name, brand, priceKobo, imageUrl, inStock }: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{brand}</p>
        <h3 className="font-semibold text-zinc-900">{name}</h3>
        <p className="mt-auto pt-2 font-semibold text-zinc-900">{formatNaira(priceKobo)}</p>
      </div>
    </Link>
  );
}
