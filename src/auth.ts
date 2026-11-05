import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { authConfig } from "./auth.config";

const schema = z.object({
  identifier: z.string().min(3).max(120),
  password: z.string().min(8).max(128),
});

const MAX_FAILS = 5;
const LOCK_MINUTES = 15;
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.4kYkQy3m1m3QJm4YQY2Z7s0o2o6K"; // Prevents timing attacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { identifier: {}, password: {} },
      async authorize(raw) {
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;

        // Auto-detect email vs phone login
        const where = identifier.includes("@")
          ? { email: identifier.trim().toLowerCase() }
          : { phone: normalizePhone(identifier) ?? "invalid" };

        const user = await db.user.findUnique({ where });
        if (!user || !user.isActive) {
          // Perform dummy comparison so invalid usernames take the exact same time as valid ones
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        // Check if account is temporarily locked
        if (user.lockedUntil && user.lockedUntil > new Date()) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          const fails = user.failedLogins + 1;
          await db.user.update({
            where: { id: user.id },
            data: {
              failedLogins: fails,
              lockedUntil: fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MINUTES * 60000) : null,
            },
          });
          return null;
        }

        // Reset failed login counter on successful sign-in
        await db.user.update({
          where: { id: user.id },
          data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          clinicId: user.clinicId,
        };
      },
    }),
  ],
});