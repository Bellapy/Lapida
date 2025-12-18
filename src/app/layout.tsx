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
    <html lang="pt-BR" suppressHydrationWarning>
      {/* MODIFICATION START - Aplicando um gradiente de fundo mais sofisticado */}
      <body
        className={`${andika.variable} font-sans text-white bg-[#1E1E2A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]`}
      >
      {/* MODIFICATION END */}
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}