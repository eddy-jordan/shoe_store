import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const SIZES = ["40", "41", "42", "43", "44", "45"];

const categories = [
  { name: "Sneakers", slug: "sneakers" },
  { name: "Running", slug: "running" },
  { name: "Boots", slug: "boots" },
];

const products = [
  {
    name: "Aero Runner",
    slug: "aero-runner",
    brand: "Velox",
    description:
      "Lightweight everyday runner with breathable mesh upper and responsive foam midsole.",
    priceKobo: 4_500_000,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "running",
  },
  {
    name: "Street Classic",
    slug: "street-classic",
    brand: "Kadence",
    description: "Timeless low-top sneaker built for everyday street style.",
    priceKobo: 3_800_000,
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    category: "sneakers",
  },
  {
    name: "Trail Blazer Boot",
    slug: "trail-blazer-boot",
    brand: "Northgear",
    description: "Rugged waterproof boot for trail and city wear alike.",
    priceKobo: 6_200_000,
    imageUrl:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    category: "boots",
  },
  {
    name: "Cloudstep Trainer",
    slug: "cloudstep-trainer",
    brand: "Velox",
    description: "Max-cushioned trainer for long days on your feet.",
    priceKobo: 5_100_000,
    imageUrl:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    category: "running",
  },
  {
    name: "Heritage High-Top",
    slug: "heritage-high-top",
    brand: "Kadence",
    description: "Retro-inspired high-top with premium leather panels.",
    priceKobo: 4_200_000,
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    category: "sneakers",
  },
  {
    name: "Summit Chukka Boot",
    slug: "summit-chukka-boot",
    brand: "Northgear",
    description: "Suede chukka boot with a rugged lugged sole.",
    priceKobo: 5_600_000,
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    category: "boots",
  },
  {
    name: "Featherlight Racer",
    slug: "featherlight-racer",
    brand: "Velox",
    description: "Race-day sneaker built for speed, at a featherlight weight.",
    priceKobo: 4_900_000,
    imageUrl:
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80",
    category: "running",
  },
  {
    name: "Court Icon",
    slug: "court-icon",
    brand: "Kadence",
    description: "Classic court sneaker silhouette with a durable rubber outsole.",
    priceKobo: 3_500_000,
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    category: "sneakers",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.category },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        brand: product.brand,
        description: product.description,
        priceKobo: product.priceKobo,
        imageUrl: product.imageUrl,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        description: product.description,
        priceKobo: product.priceKobo,
        imageUrl: product.imageUrl,
        categoryId: category.id,
        variants: {
          create: SIZES.map((size) => ({
            size,
            stock: Math.floor(Math.random() * 15) + 3,
          })),
        },
      },
    });
  }

  const adminPasswordHash = await hashPassword("Admin123!");
  await prisma.user.upsert({
    where: { email: "admin@stride-shoes.com" },
    update: {},
    create: {
      email: "admin@stride-shoes.com",
      name: "Store Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const customerPasswordHash = await hashPassword("Customer123!");
  await prisma.user.upsert({
    where: { email: "customer@stride-shoes.com" },
    update: {},
    create: {
      email: "customer@stride-shoes.com",
      name: "Test Customer",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@stride-shoes.com / Admin123!");
  console.log("Customer login: customer@stride-shoes.com / Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
