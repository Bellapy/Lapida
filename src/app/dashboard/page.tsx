'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Image from 'next/image'
import { Plus, Search } from 'lucide-react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/features/tasks/task-list'
import { WindowFrame } from '@/components/ui/window-frame'
import { useAppStore } from '@/hooks/use-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Category {
  id: string
  name: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { setSelectedCategoryId } = useAppStore()
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)

  const header = (
    <h2 className="font-bold">
      Bem vindo, {session?.user?.name || 'usuário'}.
    </h2>
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-0 sm:p-4 font-sans">
      <WindowFrame
        headerContent={header}
        className="h-screen w-screen sm:h-[90vh] sm:max-h-[800px] sm:w-full sm:max-w-4xl rounded-none sm:rounded-lg"
      >
        <div className="flex flex-grow flex-col overflow-y-auto p-6">
          {/* HEADER */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_200px]">
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

            <div className="hidden md:flex items-center justify-center overflow-hidden rounded-md">
              <Image
                src="/butterfly.png"
                alt="Borboleta brilhante"
                width={200}
                height={120}
                className="object-cover"
              />
            </div>
          </div>

          {/* LISTA */}
          <div className="flex-grow">
            <h3 className="mb-2 font-bold">Minhas Tarefas</h3>

            {/* FILTRO */}
            <div className="relative mb-4">
              <Select
                onValueChange={(value) =>
                  setSelectedCategoryId(value === 'all' ? 'all' : value)
                }
              >
                <SelectTrigger
                  className="
                    h-11
                    rounded-md
                    border border-os-border/80
                    bg-os-input-bg
                    pl-11
                    text-sm
                    font-medium
                    text-os-text
                    shadow-sm
                    hover:bg-os-input-bg/90
                    focus:ring-2 focus:ring-os-primary/40
                    data-[placeholder-shown]:text-gray-800
                  "
                >
                  <SelectValue
                    placeholder="Filtrar por categoria"
                    className="text-gray-800"
                  />
                </SelectTrigger>

                <SelectContent className="bg-os-window-bg text-os-text border-os-border">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-700
                  z-10
                  pointer-events-none
                "
                size={18}
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
