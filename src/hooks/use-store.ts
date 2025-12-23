import { create } from 'zustand'

// MODIFICATION START
// Para garantir a consistência, vamos definir a estrutura de uma tarefa aqui
// ou importar de um arquivo de tipos compartilhado. Por enquanto, definiremos aqui.
interface Task {
  id: string
  title: string
  description: string | null
  date: string
  status: 'PENDING' | 'COMPLETED'
  category: {
    id: string
    name: string
  } | null
}

// A interface do nosso estado agora incluirá o controle do modal.
interface AppState {
  // Estado do filtro de categoria
  selectedCategoryId: string | 'all'
  setSelectedCategoryId: (categoryId: string | 'all') => void

  // Estado do modal de edição
  isModalOpen: boolean
  editingTask: Task | null
  openEditModal: (task: Task) => void
  closeEditModal: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Valores iniciais para o filtro
  selectedCategoryId: 'all',
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),

  // Valores iniciais para o modal
  isModalOpen: false,
  editingTask: null,
  openEditModal: (task) => set({ isModalOpen: true, editingTask: task }),
  closeEditModal: () => set({ isModalOpen: false, editingTask: null }),
}))
// MODIFICATION END