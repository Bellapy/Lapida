'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Edit, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSWRConfig } from 'swr'
import { cn } from '@/lib/utils'
import { Task } from './task-list'
import Link from 'next/link'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { mutate } = useSWRConfig()

  // Função para deletar a tarefa com atualização otimista
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

  // Função para alternar o status da tarefa com atualização otimista
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
    new Date(new Date(task.date).getTime() + 30 * 60000), // Exemplo: duração de 30min
    'HH:mm'
  )
  const displayTime = `${startTime} - ${endTime}`

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md border-2 border-os-border bg-os-primary p-3 text-os-text transition-colors',
        isCompleted && 'bg-os-primary/50'
      )}
    >
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-4">
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
            {task.title}
          </p>
        </div>
        {task.description && (
          <p
            className={cn(
              'pl-[5.5rem] text-sm text-os-text/70',
              isCompleted && 'line-through'
            )}
          >
            {task.description}
          </p>
        )}
        {task.category && (
          <span className="ml-1 mt-1 rounded-full bg-os-window-bg px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-os-text/60">
            {task.category.name}
          </span>
        )}
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
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-os-text hover:bg-black/10 hover:text-blue-500"
        >
          <Link href={`/dashboard/edit/${task.id}`}>
            <Edit size={18} />
          </Link>
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