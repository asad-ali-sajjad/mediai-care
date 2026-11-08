import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; role?: string; clinicId?: string | null };
        const t = token as { uid?: string; role?: string; clinicId?: string | null };
        t.uid = u.id;
        t.role = u.role;
        t.clinicId = u.clinicId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        const sUser = session.user as {
          id?: string;
          role?: string;
          clinicId?: string | null;
        };
        const t = token as { uid?: string; sub?: string; role?: string; clinicId?: string | null };

        sUser.id = t.uid ?? t.sub ?? "";
        if (t.role !== undefined) {
          sUser.role = t.role;
        }
        if (t.clinicId !== undefined) {
          sUser.clinicId = t.clinicId;
        }
      }
      return session;
    },
  },
};

export default authConfig;