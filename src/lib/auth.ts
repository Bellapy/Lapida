import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Busca o usuário no banco
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        // Se não existir usuário ou não tiver senha (usuários OAuth)
        if (!user || !user.password) return null

        // Verifica se a senha bate usando bcrypt
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordCorrect) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Define nossa página customizada de login
  },
  session: { strategy: "jwt" }, // Usaremos tokens JWT para a sessão
})