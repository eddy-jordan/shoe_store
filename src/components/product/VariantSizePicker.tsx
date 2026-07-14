"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/money";
import { useCartStore } from "@/store/cart-store";

interface Variant {
  id: string;
  size: string;
  stock: number;
}

interface VariantSizePickerProps {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceKobo: number;
  variants: Variant[];
}

export function VariantSizePicker({ productId, slug, name, imageUrl, priceKobo, variants }: VariantSizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = variants.find((v) => v.size === selectedSize);

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      productId,
      variantId: selectedVariant.id,
      slug,
      name,
      size: selectedVariant.size,
      unitPriceKobo: priceKobo,
      imageUrl,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">Select size (EU)</p>
        <div className="flex flex-wrap gap-2">
          {variants
            .slice()
            .sort((a, b) => a.size.localeCompare(b.size))
            .map((variant) => {
              const isOutOfStock = variant.stock === 0;
              const isSelected = selectedSize === variant.size;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`h-11 w-14 rounded-lg border text-sm font-medium transition-colors ${
                    isOutOfStock
                      ? "cursor-not-allowed border-zinc-100 text-zinc-300 line-through"
                      : isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-900"
                  }`}
                >
                  {variant.size}
                </button>
              );
            })}
        </div>
      </div>

      <button
        type="button"
        disabled={!selectedVariant}
        onClick={handleAddToCart}
        className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {justAdded
          ? "Added to cart ✓"
          : selectedVariant
            ? `Add to cart — ${formatNaira(priceKobo)}`
            : "Select a size"}
      </button>
    </div>
  );
}
