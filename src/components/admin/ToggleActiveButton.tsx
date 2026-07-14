"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleActiveButton({ productId, isActive }: { productId: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-sm font-medium text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed"
    >
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
