import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/butterfly.png"
          alt="background"
          layout="fill"
          objectFit="cover"
          className="opacity-10 blur-2xl"
        />
      </div>
      <main className="z-10 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Lápida
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300">
          Transforme pequenas ações em grandes hábitos. A organização pessoal inspirada pelo Efeito Borboleta.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Começar Agora</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}