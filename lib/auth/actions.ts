"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, clearSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function registerCustomer(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };

  const limit = rateLimit(`register:${parsed.data.email.toLowerCase()}`, 5, 60 * 60);
  if (!limit.allowed) return { success: false, error: "Too many attempts. Please try again later." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { success: false, error: "An account with this email already exists." };

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      phone: parsed.data.phone,
      role: "CUSTOMER",
      customer: { create: {} },
    },
  });

  await createSession({ userId: user.id, role: user.role, email: user.email });
  return { success: true };
}

export async function loginUser(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Enter a valid email and password." };

  const limit = rateLimit(`login:${parsed.data.email.toLowerCase()}`, 8, 15 * 60);
  if (!limit.allowed) return { success: false, error: "Too many attempts. Please try again in a few minutes." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Same generic error whether the email doesn't exist or the password is wrong —
  // never reveal which, to avoid leaking which emails are registered.
  if (!user || !user.isActive) return { success: false, error: "Invalid email or password." };

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return { success: false, error: "Invalid email or password." };

  await createSession({ userId: user.id, role: user.role, email: user.email });
  return { success: true };
}

export async function logoutUser() {
  await clearSession();
}
