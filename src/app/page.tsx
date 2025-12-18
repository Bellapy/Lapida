import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Cinzel } from 'next/font/google' // Importar a nova fonte
import { cn } from '@/lib/utils'

// Configurar a fonte
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cinzel',
})

export default function HomePage() {
  return (
    // Adicionar a variável da fonte ao container principal da página
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center p-4 text-center',
        cinzel.variable
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/butterfly.png"
          alt="background"
          layout="fill"
          objectFit="cover"
          className="opacity-10 blur-2xl"
          priority
        />
      </div>
      <main className="z-10 flex flex-col items-center">
        {/* Aplicar a fonte do título */}
        <h1 className="font-heading text-6xl font-bold tracking-wider text-transparent md:text-8xl bg-clip-text bg-gradient-to-b from-white to-gray-400">
          Lápida
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
          Transforme pequenas ações em grandes hábitos. A organização pessoal
          inspirada pelo Efeito Borboleta.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="bg-os-primary font-bold text-os-text hover:bg-os-primary-hover">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-bold">
            <Link href="/register">Começar Agora</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}