export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-zinc-100" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    </div>
  );
}
