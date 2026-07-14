"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
      <p className="text-zinc-500">Please try again, or head back to the homepage.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
