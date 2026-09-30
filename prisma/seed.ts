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
  // Note: these use `update` (not just `create`) so re-running the seed keeps
  // them in sync with the values below. If you start editing settings for
  // real via /admin/settings, remove the relevant `update` line here so a
  // future reseed doesn't overwrite what you set in the admin panel.
  await prisma.siteSetting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "+923241175708" },
    create: { key: "whatsapp_number", value: "+923241175708" },
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
    imageUrl2?: string;
    videoFiles?: { title: string; url: string; thumbnailUrl: string }[];
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
      imageUrl: "/media/images/black-pinstripe-selvedge.jpg",
      imageUrl2: "/media/images/charcoal-selvedge.jpg",
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
      imageUrl: "/media/images/printed-suit-set.jpg",
      imageUrl2: "/media/images/colour-rack.jpg",
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
      imageUrl: "/media/images/black-satin-drape.jpg",
      imageUrl2: "/media/images/heritage-robe.jpg",
      videoFiles: [
        { title: "MA Sherwani Velvet — Black", url: "/media/videos/sherwani-black.mp4", thumbnailUrl: "/media/posters/sherwani-black.jpg" },
        { title: "MA Sherwani Velvet — Maroon", url: "/media/videos/sherwani-maroon.mp4", thumbnailUrl: "/media/posters/sherwani-maroon.jpg" },
      ],
    },
  ];

  for (const p of products) {
    const { stock, imageUrl, imageUrl2, videoFiles, ...productFields } = p;
    const productImages = [
      { url: imageUrl ?? "/media/images/neutral-rack.jpg", alt: p.name, position: 0 },
      ...(imageUrl2 ? [{ url: imageUrl2, alt: `${p.name} — detail`, position: 1 }] : []),
    ];
    const productColorIds = (p.slug === "ma-hawal-suiting" ? colors : colors.slice(0, 6)).map((c) => c.id);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      // On a re-run (product already exists), sync its core fields so edits to
      // this file actually reach the database — an empty `update: {}` here
      // would silently do nothing, which is exactly what happened before this
      // fix: later image/description changes never applied after the first seed.
      update: {
        ...productFields,
        categoryId: categories[0]!.id,
        collectionId: collections[0]!.id,
      },
      create: {
        ...productFields,
        isPublished: true,
        categoryId: categories[0]!.id,
        collectionId: collections[0]!.id,
      },
    });

    // Images, colors, and videos are relations — upsert's nested `create` only
    // fires on first insert, so replace them explicitly every run to stay in sync.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: productImages.map((img) => ({ ...img, productId: product.id })),
    });

    await prisma.productColor.deleteMany({ where: { productId: product.id } });
    await prisma.productColor.createMany({
      data: productColorIds.map((colorId) => ({ productId: product.id, colorId })),
    });

    if (videoFiles) {
      await prisma.productVideo.deleteMany({ where: { productId: product.id } });
      await prisma.productVideo.createMany({
        data: videoFiles.map((v, i) => ({
          productId: product.id,
          title: v.title,
          url: v.url,
          thumbnailUrl: v.thumbnailUrl,
          type: VideoType.PRODUCT_SHOWCASE,
          isPublished: true,
          position: i,
        })),
      });
    }

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
