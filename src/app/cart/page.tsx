"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalKobo = items.reduce((sum, item) => sum + item.unitPriceKobo * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Your cart is empty</h1>
        <p className="text-zinc-500">Looks like you haven&apos;t added any shoes yet.</p>
        <Link
          href="/products"
          className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Shop shoes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900">Your Cart</h1>
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </div>
        <div>
          <CartSummary totalKobo={totalKobo} />
        </div>
      </div>
    </div>
  );
}
