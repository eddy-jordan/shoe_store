import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-zinc-500 sm:px-6">
        <p className="text-lg font-bold tracking-tight text-zinc-900">STRIDE</p>
        <p>Shoes built to move.</p>

        <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
          <Link href="/privacy-policy" className="hover:text-zinc-900">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-zinc-900">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="hover:text-zinc-900">
            Refund & Return Policy
          </Link>
          <a href="mailto:support@stride-shoes.com" className="hover:text-zinc-900">
            support@stride-shoes.com
          </a>
        </nav>

        <p className="mt-4 text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} Stride. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
