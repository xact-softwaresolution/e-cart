const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// NOTE: Prisma client's `$use` middleware isn't available in this runtime
// environment (Prisma build/version differences). Keep the shared client
// here and apply `isDeleted: false` filters explicitly where necessary.

module.exports = prisma;
