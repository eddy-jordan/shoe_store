import Link from "next/link";
import { auth, signOut } from "@/auth";
import { CartBadge } from "./CartBadge";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          STRIDE
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <Link href="/products" className="hover:text-zinc-900">
            Shop
          </Link>
          {session?.user && (
            <Link href="/orders" className="hover:text-zinc-900">
              My Orders
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-zinc-900">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Sign in
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            Cart
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}
