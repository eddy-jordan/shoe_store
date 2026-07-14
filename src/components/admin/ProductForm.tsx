"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const SIZES = ["40", "41", "42", "43", "44", "45"];

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  productId?: string;
  initial?: {
    name: string;
    slug: string;
    brand: string;
    description: string;
    priceNaira: number;
    imageUrl: string;
    categoryId: string;
    isActive: boolean;
    variantStock: Record<string, number>;
  };
}

export function ProductForm({ categories, productId, initial }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceNaira, setPriceNaira] = useState(initial?.priceNaira?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [variantStock, setVariantStock] = useState<Record<string, string>>(
    Object.fromEntries(SIZES.map((size) => [size, String(initial?.variantStock[size] ?? 0)])),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      slug,
      brand,
      description,
      priceKobo: Math.round(Number(priceNaira) * 100),
      imageUrl,
      categoryId,
      isActive: initial?.isActive ?? true,
      variants: SIZES.map((size) => ({ size, stock: Number(variantStock[size]) || 0 })),
    };

    const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
      method: productId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="brand" className="text-sm font-medium text-zinc-700">
            Brand
          </label>
          <input
            id="brand"
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-zinc-700">
            Price (NGN)
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step="1"
            required
            value={priceNaira}
            onChange={(e) => setPriceNaira(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="imageUrl" className="text-sm font-medium text-zinc-700">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">Stock by size (EU)</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col gap-1">
              <label htmlFor={`stock-${size}`} className="text-xs text-zinc-500">
                EU {size}
              </label>
              <input
                id={`stock-${size}`}
                type="number"
                min={0}
                value={variantStock[size]}
                onChange={(e) => setVariantStock((prev) => ({ ...prev, [size]: e.target.value }))}
                className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-900 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-fit sm:px-8"
      >
        {loading ? "Saving..." : productId ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
