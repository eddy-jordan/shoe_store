import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Products</h2>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          New product
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
          return (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4"
            >
              <div>
                <p className="font-semibold text-zinc-900">
                  {product.name} {!product.isActive && <span className="text-xs text-red-600">(inactive)</span>}
                </p>
                <p className="text-sm text-zinc-500">
                  {product.brand} &middot; {product.category.name} &middot; {formatNaira(product.priceKobo)} &middot;{" "}
                  {totalStock} in stock
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Edit
                </Link>
                <ToggleActiveButton productId={product.id} isActive={product.isActive} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
