import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, address: true, user: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h2>
          <p className="text-sm text-zinc-500">{order.user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <OrderStatusBadge status={order.status} />
          <OrderStatusUpdater orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-zinc-200 p-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-zinc-600">
            <span>
              {item.product.name} &middot; {item.quantity} &times; {formatNaira(item.unitPriceKobo)}
            </span>
            <span className="font-medium text-zinc-900">
              {formatNaira(item.unitPriceKobo * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t border-zinc-200 pt-4 font-semibold text-zinc-900">
          <span>Total</span>
          <span>{formatNaira(order.totalKobo)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-6">
        <h3 className="mb-3 font-semibold text-zinc-900">Shipping address</h3>
        <p className="text-sm text-zinc-600">{order.address.fullName}</p>
        <p className="text-sm text-zinc-600">{order.address.phone}</p>
        <p className="text-sm text-zinc-600">{order.address.line1}</p>
        <p className="text-sm text-zinc-600">
          {order.address.city}, {order.address.state}, {order.address.country}
        </p>
      </div>
    </div>
  );
}
