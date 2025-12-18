import { create } from 'zustand'
import { Task } from '@/components/features/tasks/task-list' // Reutilizando nosso tipo Task

interface AppState {
  // Estado para o filtro de categoria
  selectedCategoryId: string | 'all'
  setSelectedCategoryId: (categoryId: string | 'all') => void

  // Estado para o modal de edição
  editingTask: Task | null
  isModalOpen: boolean
  openEditModal: (task: Task) => void
  closeEditModal: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Filtro
  selectedCategoryId: 'all',
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),

  // Modal
  editingTask: null,
  isModalOpen: false,
  openEditModal: (task) => set({ editingTask: task, isModalOpen: true }),
  closeEditModal: () => set({ editingTask: null, isModalOpen: false }),
}))