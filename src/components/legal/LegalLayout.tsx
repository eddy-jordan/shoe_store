import type { ReactNode } from "react";

export function LegalLayout({ title, updatedAt, children }: { title: string; updatedAt: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: {updatedAt}</p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a starter template, not legal advice. Have it reviewed by a qualified lawyer
        familiar with e-commerce and consumer protection law in your jurisdiction before relying
        on it with real customers.
      </div>

      <div className="prose-legal mt-10 flex flex-col gap-6 text-zinc-700 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
