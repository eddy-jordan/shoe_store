import Link from "next/link";
import { formatNaira } from "@/lib/money";

export function CartSummary({ totalKobo }: { totalKobo: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-6">
      <h2 className="font-semibold text-zinc-900">Order summary</h2>
      <div className="flex justify-between text-sm text-zinc-600">
        <span>Subtotal</span>
        <span>{formatNaira(totalKobo)}</span>
      </div>
      <p className="text-xs text-zinc-400">Shipping and taxes calculated at checkout.</p>
      <Link
        href="/checkout"
        className="mt-2 w-full rounded-full bg-zinc-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        Checkout
      </Link>
    </div>
  );
}
