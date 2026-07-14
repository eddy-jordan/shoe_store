export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-zinc-500 sm:px-6">
        <p className="text-lg font-bold tracking-tight text-zinc-900">STRIDE</p>
        <p>Shoes built to move.</p>
        <p className="mt-4 text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} Stride. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
