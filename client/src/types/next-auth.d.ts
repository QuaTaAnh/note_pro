import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    hasuraToken?: string;
    workspaceSlug?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    hasuraToken?: string;
    workspaceSlug?: string;
  }
}
