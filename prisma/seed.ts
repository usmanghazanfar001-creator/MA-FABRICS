import "dotenv/config";
import { PrismaClient, Season, VideoType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user (dev only — never hard-code real credentials) ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@mafabrics.test";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      name: "MA Fabrics Admin",
    },
  });

  // --- Site settings ---
  await prisma.siteSetting.upsert({
    where: { key: "whatsapp_number" },
    update: {},
    create: { key: "whatsapp_number", value: "+923001234567" }, // TEMP: from Grace Fabrics flyer — replace with the real business number
  });
  await prisma.siteSetting.upsert({
    where: { key: "shop_address" },
    update: {},
    create: { key: "shop_address", value: "Shop # G-45, Karkhana Bazar, Faisalabad" }, // TEMP: from flyer
  });
  await prisma.siteSetting.upsert({
    where: { key: "shipping_flat_rate" },
    update: {},
    create: { key: "shipping_flat_rate", value: "250" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "currency" },
    update: {},
    create: { key: "currency", value: "PKR" },
  });

  // --- Colors ---
  const colorData = [
    { name: "Black", hex: "#111111" },
    { name: "Charcoal", hex: "#30343B" },
    { name: "Dark Grey", hex: "#4A4A4A" },
    { name: "Maroon", hex: "#641F2B" },
    { name: "Brown", hex: "#5A3A22" },
    { name: "Coffee", hex: "#4B3221" },
    { name: "Navy Blue", hex: "#142B4A" },
    { name: "Teal Blue", hex: "#176B78" },
    { name: "Beige", hex: "#D6C4A5" },
    { name: "Olive Green", hex: "#5C6B3C" },
  ];
  const colors = await Promise.all(
    colorData.map((c) =>
      prisma.color.upsert({ where: { name: c.name }, update: {}, create: c })
    )
  );

  // --- Categories & Collections ---
  const categoryNames = ["Suiting", "Unstitched", "Summer", "Winter", "Premium", "Luxury"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase() },
      })
    )
  );

  const collectionNames = ["Premium Suiting", "Summer Collection", "Winter Collection", "Luxury Collection"];
  const collections = await Promise.all(
    collectionNames.map((name) =>
      prisma.collection.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      })
    )
  );

  // --- Demo products (fictional; clearly seed data) ---
  const products: {
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    fabricType: string;
    texture: string;
    season: Season;
    recommendedUse: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    stock: number;
    imageUrl?: string;
  }[] = [
    {
      name: "MA Hawal Suiting",
      slug: "ma-hawal-suiting",
      sku: "MA-HW-001",
      description:
        "Super fine quality suiting fabric with a smooth finish, woven for all-season comfort and a refined drape — ideal for suits, shalwar kameez, and waistcoats. Available in 10 elegant colors.",
      shortDescription: "Super fine quality, all-season suiting.",
      price: 4500,
      compareAtPrice: 5200,
      fabricType: "Premium Suiting",
      texture: "Smooth",
      season: Season.ALL_SEASON,
      recommendedUse: "Suits / Shalwar Kameez / Waistcoats",
      isFeatured: true,
      stock: 120,
      // Product photo intentionally left as a placeholder — the Grace Fabrics
      // flyer is promotional artwork, not product photography, so it isn't
      // used as the image here. Swap /placeholder-fabric.jpg for real photos.
    },
    {
      name: "MA Nafees Cotton",
      slug: "ma-nafees-cotton",
      sku: "MA-NC-002",
      description: "Breathable premium cotton fabric designed for warm-weather comfort without compromising on refinement.",
      shortDescription: "Breathable summer cotton.",
      price: 2800,
      fabricType: "Cotton",
      texture: "Light",
      season: Season.SUMMER,
      recommendedUse: "Shalwar Kameez",
      isNewArrival: true,
      stock: 200,
    },
    {
      name: "MA Sherwani Velvet",
      slug: "ma-sherwani-velvet",
      sku: "MA-SV-003",
      description: "A rich velvet-finish fabric for winter formalwear, with a heavier weight and a deep, luxurious texture.",
      shortDescription: "Rich winter velvet finish.",
      price: 7800,
      fabricType: "Velvet Blend",
      texture: "Plush",
      season: Season.WINTER,
      recommendedUse: "Sherwani / Waistcoats",
      isFeatured: true,
      stock: 60,
    },
  ];

  for (const p of products) {
    const { stock, imageUrl, ...productFields } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productFields,
        isPublished: true,
        categoryId: categories[0]!.id,
        collectionId: collections[0]!.id,
        images: {
          create: [{ url: imageUrl ?? "/placeholder-fabric.jpg", alt: p.name, position: 0 }],
        },
        colors: {
          // MA Hawal Suiting ships in all 10 colors per the flyer; others get a 6-color sample.
          create: (p.slug === "ma-hawal-suiting" ? colors : colors.slice(0, 6)).map((c) => ({ colorId: c.id })),
        },
        videos: {
          create: [
            {
              title: `${p.name} — Fabric Showcase`,
              url: "/placeholder-video.mp4",
              type: VideoType.FABRIC_TEXTURE,
              isPublished: true,
            },
          ],
        },
      },
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { stockMeters: stock },
      create: { productId: product.id, stockMeters: stock, lowStockThreshold: 15 },
    });
  }

  console.log("Seed complete.");
  console.log(`Demo admin: ${adminEmail} / (see SEED_ADMIN_PASSWORD env var)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
