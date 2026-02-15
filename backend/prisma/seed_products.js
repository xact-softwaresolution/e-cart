require("dotenv").config();
const prisma = require("../src/shared/prisma/client");

async function main() {
  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Accessories" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const electronics = await prisma.category.findUnique({ where: { name: "Electronics" } });
  const clothing = await prisma.category.findUnique({ where: { name: "Clothing" } });

  const products = [
    {
      name: "Quantum Headset",
      description: "High-fidelity wireless audio with noise cancellation.",
      price: 199.99,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      categoryId: electronics.id,
    },
    {
      name: "Stellar Phone",
      description: "Fast processing and stunning display.",
      price: 899.99,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      categoryId: electronics.id,
    },
    {
      name: "Urban Tee",
      description: "Premium cotton t-shirt for daily comfort.",
      price: 29.99,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      categoryId: clothing.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeded categories and products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
