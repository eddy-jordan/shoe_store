import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

const STATUSES = ["PENDING", "PAID", "FAILED", "SHIPPED", "DELIVERED"] as const;

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as (typeof STATUSES)[number] } : undefined,
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900">Orders</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            !status ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-600"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              status === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-600"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500">No orders match this filter.</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 hover:border-zinc-900"
            >
              <div>
                <p className="font-semibold text-zinc-900">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-zinc-500">
                  {order.user.email} &middot; {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-zinc-900">{formatNaira(order.totalKobo)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
