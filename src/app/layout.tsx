import type { Metadata } from 'next'
import { Andika } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/components/providers/session-provider'

const andika = Andika({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-andika',
})

export const metadata: Metadata = {
  title: 'Lápida',
  description: 'Pequenas ações, grandes transformações.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // MODIFICATION: Adicionando a classe "dark" para forçar o tema escuro
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${andika.variable} bg-[#1E1E2A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-sans text-white`}
      >
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}