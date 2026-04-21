import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    avatarUrl?: string | null;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    role?: "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";
    status?: "ACTIVE" | "INACTIVE" | "DELETE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    avatarUrl?: string | null;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    sub: string;
    role?: "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";
    status?: "ACTIVE" | "INACTIVE" | "DELETE";
  }
}
