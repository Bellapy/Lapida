import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/features/tasks/task-list'
import { Suspense } from 'react'
import Image from 'next/image'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { WindowFrame } from '@/components/ui/window-frame' // Importar o novo componente

export default async function DashboardPage() {
  const session = await auth()

  const header = (
    <h2 className="font-bold">
      Bem vindo, {session?.user?.name || 'usuário'}.
    </h2>
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <WindowFrame
        headerContent={header}
        className="h-[80vh] max-h-[800px] w-full max-w-4xl"
      >
        {/* O conteúdo principal da janela agora é passado como children */}
        <div className="flex flex-grow flex-col overflow-y-auto p-6">
          {/* Seção Superior */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_200px]">
            {/* ... (o conteúdo interno da citação e da imagem permanece o mesmo) ... */}
            <div className="flex flex-col justify-between rounded-md border border-os-border/50 bg-gray-200 p-4">
              <p className="mb-4 text-lg">
                “ O caos começa no que você deixa para depois.”
              </p>
              <Button
                asChild
                className="flex w-fit items-center gap-2 rounded-md border-2 border-os-border bg-os-primary px-4 py-2 text-sm font-bold text-os-text shadow-sm hover:bg-os-primary-hover"
              >
                <Link href="/dashboard/new">
                  <Plus size={16} />
                  ADICIONAR nova tarefa
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center overflow-hidden rounded-md">
              <Image
                src="/butterfly.png"
                alt="Borboleta brilhante"
                width={200}
                height={120}
                className="object-cover"
              />
            </div>
          </div>

          {/* Seção Inferior - Tarefas */}
          <div className="flex-grow">
            <h3 className="mb-2 font-bold">Minhas Tarefas</h3>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <Input
                placeholder="Filtrar por categoria"
                className="rounded-md border-os-border/70 bg-os-input-bg pl-10 text-os-text placeholder:text-gray-500"
              />
            </div>
            
            <Suspense fallback={<p className="text-center">Carregando...</p>}>
              <TaskList />
            </Suspense>
          </div>
        </div>
      </WindowFrame>
    </div>
  )
}