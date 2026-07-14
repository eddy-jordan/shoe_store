"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function Navbar() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          STRIDE
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <Link href="/products" className="hover:text-zinc-900">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            Cart
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
