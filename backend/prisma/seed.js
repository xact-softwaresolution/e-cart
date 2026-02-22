require("dotenv").config();
const prisma = require("../src/shared/prisma/client");
const bcrypt = require("bcrypt");

async function main() {
  const email = "admin@gmail.com";
  const password = "admin123";
  const role = "ADMIN";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Admin User",
        role,
      },
    });
    console.log(`Created admin user: ${user.email}`);

    // Create cart for admin
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
