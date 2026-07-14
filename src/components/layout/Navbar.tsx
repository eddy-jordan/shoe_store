import Link from "next/link";
import { auth, signOut } from "@/auth";
import { CartBadge } from "./CartBadge";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const session = await auth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    ...(session?.user ? [{ href: "/orders", label: "My Orders" }] : []),
    ...(session?.user.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          STRIDE
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-zinc-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            {session?.user ? (
              <form action={handleSignOut}>
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
          </div>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12L6 6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6 5 3H3" />
              <circle cx="9.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <CartBadge />
          </Link>

          <MobileMenu navItems={navItems} isAuthed={!!session?.user} signOutAction={handleSignOut} />
        </div>
      </div>
    </header>
  );
}
