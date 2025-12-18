import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { EditTaskForm } from '@/components/features/tasks/edit-task-form'
import { WindowFrame } from '@/components/ui/window-frame'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditPageProps {
  params: {
    taskId: string
  }
}

export default async function EditTaskPage({ params }: EditPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const task = await db.task.findUnique({
    where: {
      id: params.taskId,
      userId: session.user.id,
    },
    // MODIFICATION: Incluir a relação com a categoria
    include: {
      category: true,
    },
  })

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Tarefa não encontrada ou você não tem permissão para editá-la.</p>
      </div>
    )
  }

  const header = (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="transition-opacity hover:opacity-75">
        <ArrowLeft size={18} />
      </Link>
      <h2 className="font-bold">Editar Tarefa</h2>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-0 sm:p-4 font-sans">
      <WindowFrame
        headerContent={header}
        className="h-screen w-screen sm:h-auto sm:w-full sm:max-w-2xl rounded-none sm:rounded-lg"
      >
        <div className="p-8">
          {/* A `task` que buscamos (agora com `category`) é passada como prop */}
          <EditTaskForm task={task} />
        </div>
      </WindowFrame>
    </div>
  )
}