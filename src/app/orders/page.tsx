import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">No orders yet</h1>
        <p className="text-zinc-500">Once you place an order, it&apos;ll show up here.</p>
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
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-zinc-900"
          >
            <div>
              <p className="font-semibold text-zinc-900">Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-zinc-500">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot;{" "}
                {order.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-zinc-900">{formatNaira(order.totalKobo)}</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
