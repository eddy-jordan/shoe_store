export default function ProductDetailLoading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-100" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-7 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="h-16 w-full animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}
