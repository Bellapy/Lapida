'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Edit, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSWRConfig } from 'swr'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  description: string
  date: string
  status: 'PENDING' | 'COMPLETED'
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { mutate } = useSWRConfig()

  const handleDelete = async () => {
    mutate(
      '/api/tasks',
      (currentTasks: Task[] | undefined) =>
        currentTasks?.filter((t) => t.id !== task.id) || [],
      false
    )
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    mutate('/api/tasks')
  }

  const handleToggleStatus = async () => {
    const newStatus: Task['status'] =
      task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'

    mutate(
      '/api/tasks',
      (currentTasks: Task[] | undefined) =>
        currentTasks?.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        ) || [],
      false
    )
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    mutate('/api/tasks')
  }

  const isCompleted = task.status === 'COMPLETED'
  const startTime = format(new Date(task.date), 'HH:mm')
  const endTime = format(
    new Date(new Date(task.date).getTime() + 30 * 60000),
    'HH:mm'
  )
  const displayTime = `${startTime} - ${endTime}`

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md border-2 border-os-border bg-os-primary p-3 text-os-text transition-colors',
        // MODIFICATION START - Aplicando um fundo mais escuro e opacidade seletiva
        isCompleted && 'bg-os-primary/50' // Usamos a opacidade na cor para escurecer
        // MODIFICATION END
      )}
    >
      <div className="flex items-center gap-4">
        {/* MODIFICATION START - Muted text color for completed tasks */}
        <span
          className={cn(
            'text-sm font-semibold',
            isCompleted && 'text-os-text/70'
          )}
        >
          {displayTime}
        </span>
        <p
          className={cn(
            'font-semibold',
            isCompleted && 'line-through text-os-text/70'
          )}
        >
          {task.description}
        </p>
        {/* MODIFICATION END */}
      </div>
      <div className="flex items-center gap-1">
        <Button
          onClick={handleDelete}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-os-text hover:bg-black/10 hover:text-red-500"
        >
          <Trash2 size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-os-text hover:bg-black/10 hover:text-blue-500"
        >
          <Edit size={18} />
        </Button>
        <Button
          onClick={handleToggleStatus}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-os-text hover:bg-black/10 hover:text-yellow-500"
        >
          <Star
            size={18}
            className={cn(isCompleted && 'fill-current text-yellow-500/70')}
          />
        </Button>
        <div className="ml-2 flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full border border-os-border"></div>
          <div className="h-2.5 w-2.5 rounded-full border border-os-border"></div>
        </div>
      </div>
    </div>
  )
}