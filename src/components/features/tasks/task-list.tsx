'use client'

import useSWR from 'swr'
import { TaskItem } from './task-item'
import { useAppStore } from '@/hooks/use-store'

interface Category {
  id: string
  name: string
}

export interface Task {
  id: string
  title: string // Adicionado
  description: string | null // Modificado para opcional
  date: string
  status: 'PENDING' | 'COMPLETED'
  category: Category | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TaskList() {
  const { data: tasks, error, isLoading } = useSWR<Task[]>('/api/tasks', fetcher)
  const { selectedCategoryId } = useAppStore()

  const filteredTasks = tasks?.filter((task) => {
    if (selectedCategoryId === 'all') return true
    if (selectedCategoryId === 'none') return !task.category
    return task.category?.id === selectedCategoryId
  })

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Carregando tarefas...</div>
    )
  }
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Falha ao carregar as tarefas.
      </div>
    )
  }
  if (!filteredTasks || filteredTasks.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">
        Nenhuma tarefa encontrada.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}