import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // ID pengguna
    email: string | null; // Email pengguna
  }

  interface Session {
    user: User; // Menggunakan tipe pengguna kustom
  }
}
