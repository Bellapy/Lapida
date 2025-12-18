import { create } from 'zustand'

interface AppState {
  selectedCategoryId: string | 'all'
  setSelectedCategoryId: (categoryId: string | 'all') => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedCategoryId: 'all',
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),
}))