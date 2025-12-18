'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSWR, { useSWRConfig } from 'swr'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Category {
  id: string
  name: string
}

const editTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  categoryId: z.string().optional(),
})

export function EditTaskModal() {
  const { isModalOpen, editingTask, closeEditModal } = useAppStore()
  const { mutate } = useSWRConfig()
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)

  const form = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
  })

  useEffect(() => {
    if (editingTask) {
      form.reset({
        title: editingTask.title,
        description: editingTask.description || '',
        date: new Date(editingTask.date),
        // MODIFICATION START: Corrigindo a atribuição do categoryId
        // Se a tarefa não tem categoria (category is null), o ID é undefined.
        // O Select tratará `undefined` como "nenhum valor selecionado".
        categoryId: editingTask.category?.id,
        // MODIFICATION END
      })
    }
  }, [editingTask, form])

  const onSubmit = async (values: z.infer<typeof editTaskSchema>) => {
    if (!editingTask) return

    try {
      const payload = {
        ...values,
        date: values.date.toISOString(),
        // Se o valor for 'none' ou undefined, enviamos null para a API para desassociar
        categoryId:
          !values.categoryId || values.categoryId === 'none'
            ? null
            : values.categoryId,
      }

      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      mutate('/api/tasks')
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Título:</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-os-input-bg border-os-border/70" />
                  </FormControl>
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
                    <Textarea {...field} className="bg-os-input-bg border-os-border/70 min-h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-1.5">
                      <FormLabel className="font-semibold mb-2">Data:</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal rounded-md border-os-border/70 bg-os-input-bg text-os-text hover:bg-os-input-bg',
                                !field.value && 'text-gray-500'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP', { locale: ptBR })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
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
            </div>
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