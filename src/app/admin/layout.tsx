import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-6 border-b border-zinc-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Admin</h1>
        <nav className="flex gap-6 text-sm font-medium text-zinc-600">
          <Link href="/admin" className="hover:text-zinc-900">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-zinc-900">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:text-zinc-900">
            Orders
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
