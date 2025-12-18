'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSWR, { useSWRConfig } from 'swr'
import { format } from 'date-fns'

import { useAppStore } from '@/hooks/use-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

const editTaskSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  categoryId: z.string().optional(),
})

export function EditTaskModal() {
  const { isModalOpen, editingTask, closeEditModal } = useAppStore()
  const { mutate } = useSWRConfig()
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)

  const form = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
  })
  
  // Preenche o formulário quando um `editingTask` é definido no store
  useEffect(() => {
    if (editingTask) {
      form.reset({
        description: editingTask.description,
        // O input datetime-local requer o formato 'YYYY-MM-DDTHH:mm'
        date: format(new Date(editingTask.date), "yyyy-MM-dd'T'HH:mm"),
        categoryId: editingTask.category?.id || 'none',
      })
    }
  }, [editingTask, form])

  const onSubmit = async (values: z.infer<typeof editTaskSchema>) => {
    if (!editingTask) return

    try {
      const payload = {
        ...values,
        date: new Date(values.date).toISOString(),
        categoryId: values.categoryId === 'none' ? undefined : values.categoryId,
      }

      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      mutate('/api/tasks') // Revalida a lista de tarefas
      closeEditModal()
    } catch (error) {
      console.error('Falha ao editar a tarefa', error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="bg-os-window-bg text-os-text border-os-border">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Data:</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="bg-os-input-bg border-os-border/70" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Categoria:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-os-input-bg border-os-border/70">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-os-window-bg text-os-text border-os-border">
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Descrição:</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-os-input-bg border-os-border/70 min-h-28" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}