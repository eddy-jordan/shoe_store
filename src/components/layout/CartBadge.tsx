"use client";

import { useCartStore } from "@/store/cart-store";

export function CartBadge() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  if (itemCount === 0) return null;

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
      {itemCount}
    </span>
  );
}
