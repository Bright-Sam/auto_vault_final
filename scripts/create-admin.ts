import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@autovault.com",
    },

    update: {
      passwordHash,
      role: "ADMIN",
    },

    create: {
      name: "AutoVault Admin",
      email: "admin@autovault.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("=================================");
  console.log("ADMIN ACCOUNT CREATED/UPDATED SUCCESSFULLY");
  console.log("=================================");
  console.log("Email:", admin.email);
  console.log("Password: Admin123!");
  console.log("Role:", admin.role);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });