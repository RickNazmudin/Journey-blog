// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Deklarasi tipe custom User
  interface User {
    id: string; // ID pengguna
    email: string | null; // Email pengguna
  }

  // Deklarasi tipe custom Session
  interface Session extends DefaultSession {
    user: User; // Menggunakan tipe pengguna custom yang didefinisikan di atas
  }
}
