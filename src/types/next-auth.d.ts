import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    clinicId: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      clinicId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    role: Role;
    clinicId: string | null;
  }
}