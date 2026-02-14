(async () => {
  try {
    const pkg = require("@prisma/client");
    console.log("exports keys:", Object.keys(pkg));
    const { PrismaClient } = pkg;
    console.log(
      "PrismaClient type:",
      typeof PrismaClient,
      PrismaClient && PrismaClient.name,
    );

    const p = new PrismaClient();
    console.log("Prisma instance type:", typeof p);
    console.log("has $use:", typeof p.$use);
    console.log("has $connect:", typeof p.$connect);

    await p.$connect();
    console.log("connected");
    await p.$disconnect();
    console.log("disconnected");
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
