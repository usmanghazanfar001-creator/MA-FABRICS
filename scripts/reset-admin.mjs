// Creates the admin account, resets its password, or changes its email.
// Touches ONLY the user table (unlike `prisma db seed`).
//
// Create / change password (same email):
//   node --env-file=.env scripts/reset-admin.mjs "you@example.com" "NewPassword"
//
// Change email (and password) of an existing admin:
//   node --env-file=.env scripts/reset-admin.mjs "new@example.com" "NewPassword" "old@example.com"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [email, password, oldEmail] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: node --env-file=.env scripts/reset-admin.mjs "email" "password" ["old email to replace"]');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Use a password of at least 8 characters.");
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const passwordHash = await bcrypt.hash(password, 12);
  const normalized = email.trim().toLowerCase();

  if (oldEmail) {
    const old = oldEmail.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: old } });
    if (!existing) {
      console.error(`No user found with email ${old}. Nothing changed.`);
      process.exit(1);
    }
    if (old !== normalized && (await prisma.user.findUnique({ where: { email: normalized } }))) {
      console.error(`${normalized} is already used by another account. Nothing changed.`);
      process.exit(1);
    }
    const user = await prisma.user.update({
      where: { email: old },
      data: { email: normalized, passwordHash, role: "ADMIN", isActive: true },
    });
    console.log(`Done. Admin email is now ${user.email}. Sign in at /admin/login`);
  } else {
    const user = await prisma.user.upsert({
      where: { email: normalized },
      update: { passwordHash, role: "ADMIN", isActive: true },
      create: { email: normalized, passwordHash, role: "ADMIN", name: "MA Fabrics Admin" },
    });
    console.log(`Done. You can sign in at /admin/login as ${user.email}`);
  }
} finally {
  await prisma.$disconnect();
}
