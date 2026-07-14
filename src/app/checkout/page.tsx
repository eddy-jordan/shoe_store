"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatNaira } from "@/lib/money";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const totalKobo = items.reduce((sum, item) => sum + item.unitPriceKobo * item.quantity, 0);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        address: { fullName, phone, line1, city, state, country: "Nigeria" },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    window.location.href = data.authorizationUrl;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Your cart is empty</h1>
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
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900">Checkout</h1>

      <div className="grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:col-span-2">
          <h2 className="font-semibold text-zinc-900">Shipping address</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
              Phone
            </label>
            <input
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="line1" className="text-sm font-medium text-zinc-700">
              Address
            </label>
            <input
              id="line1"
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-medium text-zinc-700">
                City
              </label>
              <input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="state" className="text-sm font-medium text-zinc-700">
                State
              </label>
              <input
                id="state"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {loading ? "Redirecting to Paystack..." : `Pay ${formatNaira(totalKobo)} with Paystack`}
          </button>
        </form>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-semibold text-zinc-900">Order summary</h2>
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm text-zinc-600">
              <span>
                {item.name} (EU {item.size}) &times; {item.quantity}
              </span>
              <span>{formatNaira(item.unitPriceKobo * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-zinc-200 pt-4 font-semibold text-zinc-900">
            <span>Total</span>
            <span>{formatNaira(totalKobo)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
