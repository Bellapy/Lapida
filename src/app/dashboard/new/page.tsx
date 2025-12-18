import { CreateTaskForm } from '@/components/features/tasks/create-task-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { WindowFrame } from '@/components/ui/window-frame' // Importar o novo componente

export default function NewTaskPage() {
  const header = (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="transition-opacity hover:opacity-75">
        <ArrowLeft size={18} />
      </Link>
      <h2 className="font-bold">Criar Tarefa</h2>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <WindowFrame
        headerContent={header}
        className="w-full max-w-2xl"
      >
        <div className="p-8">
          <CreateTaskForm />
        </div>
      </WindowFrame>
    </div>
  )
}