import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { variants: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900">Edit product</h2>
      <ProductForm
        categories={categories}
        productId={product.id}
        initial={{
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          priceNaira: product.priceKobo / 100,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          isActive: product.isActive,
          variantStock: Object.fromEntries(product.variants.map((v) => [v.size, v.stock])),
        }}
      />
    </div>
  );
}
