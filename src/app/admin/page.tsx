import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboardPage() {
  const [orderCount, paidOrders, lowStockVariants] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, select: { totalKobo: true } }),
    prisma.productVariant.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD, gt: 0 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
  ]);

  const revenueKobo = paidOrders.reduce((sum, o) => sum + o.totalKobo, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">Revenue (paid orders)</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{formatNaira(revenueKobo)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">Low stock variants</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{lowStockVariants.length}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Low stock</h2>
        {lowStockVariants.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing running low right now.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {lowStockVariants.map((variant) => (
              <Link
                key={variant.id}
                href={`/admin/products/${variant.productId}/edit`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm hover:border-zinc-900"
              >
                <span className="font-medium text-zinc-900">
                  {variant.product.name} &middot; EU {variant.size}
                </span>
                <span className="text-amber-700">{variant.stock} left</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
