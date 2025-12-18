'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Task as PrismaTask } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Category { id: string; name: string }

const editTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  categoryId: z.string().optional(),
})

interface EditTaskFormProps {
  task: PrismaTask & { category: Category | null }
}

export function EditTaskForm({ task }: EditTaskFormProps) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)

  const form = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      date: new Date(task.date),
      categoryId: task.categoryId || 'none',
    },
  })

  const onSubmit = async (values: z.infer<typeof editTaskSchema>) => {
    try {
      const payload = {
        ...values,
        date: values.date.toISOString(),
        categoryId: values.categoryId === 'none' ? null : values.categoryId,
      }

      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      mutate('/api/tasks')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Falha ao editar a tarefa', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex items-center gap-2 rounded-lg border-2 border-os-border bg-os-primary px-8 py-6 text-lg font-bold text-os-text shadow-md hover:bg-os-primary-hover"
          >
            <Star size={20} />
            {form.formState.isSubmitting ? 'SALVANDO...' : 'SALVAR'}
            <Star size={20} />
          </Button>
        </div>
      </form>
    </Form>
  )
}