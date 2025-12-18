// A página do dashboard é um Server Component, mas os componentes de filtro e modal são do cliente.
// Precisamos de um componente "wrapper" para eles.

'use client' // Transformamos a página inteira em Client Component para simplicidade

import Link from 'next/link'
import { useSession } from 'next-auth/react' // Usar hook do cliente
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { TaskList, Task } from '@/components/features/tasks/task-list'
import { EditTaskModal } from '@/components/features/tasks/edit-task-modal'
import { WindowFrame } from '@/components/ui/window-frame'
import { useAppStore } from '@/hooks/use-store'
import { Suspense } from 'react'
import Image from 'next/image'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <WindowFrame
        headerContent={header}
        className="h-[80vh] max-h-[800px] w-full max-w-4xl"
      >
        <div className="flex flex-grow flex-col overflow-y-auto p-6">
          {/* ... (Seção Superior) ... */}
          <div className="flex-grow">
            <h3 className="mb-2 font-bold">Minhas Tarefas</h3>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <Select onValueChange={(value) => setSelectedCategoryId(value)}>
                <SelectTrigger className="rounded-md border-os-border/70 bg-os-input-bg pl-10 text-os-text placeholder:text-gray-500">
                  <SelectValue placeholder="Filtrar por categoria" />
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
            </div>
            
            <Suspense fallback={<p className="text-center">Carregando...</p>}>
              <TaskList />
            </Suspense>
          </div>
        </div>
      </WindowFrame>
      <EditTaskModal />
    </div>
  )
}