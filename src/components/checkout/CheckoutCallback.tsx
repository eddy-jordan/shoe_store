"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

type Status = "verifying" | "PAID" | "FAILED" | "error";

export function CheckoutCallback() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const clearCart = useCartStore((state) => state.clear);

  const [status, setStatus] = useState<Status>("verifying");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "PAID") {
          clearCart();
          setOrderId(data.orderId);
          setStatus("PAID");
        } else {
          setStatus("FAILED");
        }
      })
      .catch(() => setStatus("error"));
  }, [reference, clearCart]);

  if (status === "verifying") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Confirming your payment...</h1>
        <p className="text-zinc-500">This will only take a moment.</p>
      </div>
    );
  }

  if (status === "PAID") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Payment successful</h1>
        <p className="text-zinc-500">Thanks for your order! We&apos;re getting your shoes ready.</p>
        <Link
          href={orderId ? `/orders/${orderId}` : "/orders"}
          className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          View order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Payment not completed</h1>
      <p className="text-zinc-500">Your payment didn&apos;t go through. Your cart is still saved.</p>
      <Link
        href="/checkout"
        className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        Try again
      </Link>
    </div>
  );
}
