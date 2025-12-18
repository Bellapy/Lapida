'use client'

import useSWR from 'swr'
import { TaskItem } from './task-item' // Importar o novo componente

interface Task {
  id: string
  description: string
  date: string
  status: 'PENDING' | 'COMPLETED'
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TaskList() {
  const { data: tasks, error, isLoading } = useSWR<Task[]>('/api/tasks', fetcher)

  if (isLoading) return <div className="p-4 text-center">Carregando tarefas...</div>
  if (error) return <div className="p-4 text-center text-red-500">Falha ao carregar as tarefas.</div>
  if (!tasks || tasks.length === 0) {
    return <p className="p-4 text-center text-gray-500">Você ainda não tem tarefas. Que tal adicionar uma?</p>
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}