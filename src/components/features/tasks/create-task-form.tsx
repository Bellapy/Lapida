'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr'
import { Star, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
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


const taskSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  categoryId: z.string().optional(),
})

export function CreateTaskForm() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [newCategoryName, setNewCategoryName] = useState('')

  // Buscar categorias existentes
  const { data: categories, mutate: mutateCategories } = useSWR<Category[]>(
    '/api/categories',
    fetcher
  )

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { description: '', date: '', categoryId: '' },
  })

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    // Atualização otimista para categorias
    mutateCategories(
      [...(categories || []), { id: 'temp-id', name: newCategoryName }],
      false
    )

    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: newCategoryName }),
    })
    
    setNewCategoryName('')
    mutateCategories() // Revalida para obter o ID real
  }

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          date: new Date(values.date).toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Falha ao criar tarefa')

      mutate('/api/tasks')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error(error)
      form.setError('root', { message: 'Erro ao salvar. Tente novamente.' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Data:</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  className="rounded-md border-os-border/70 bg-os-input-bg text-os-text placeholder:text-gray-500"
                />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-md border-os-border/70 bg-os-input-bg text-os-text">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
        
        <div className="flex items-center gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Ou crie uma nova categoria"
            className="rounded-md border-os-border/70 bg-os-input-bg text-os-text placeholder:text-gray-500"
          />
          <Button
            type="button"
            onClick={handleCreateCategory}
            className="bg-os-primary text-os-text hover:bg-os-primary-hover"
          >
            <PlusCircle size={18} />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Descrição:</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="..."
                  {...field}
                  className="min-h-32 rounded-md border-os-border/70 bg-os-input-bg text-os-text placeholder:text-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="flex items-center gap-2 rounded-lg border-2 border-os-border bg-os-primary px-8 py-6 text-lg font-bold text-os-text shadow-md hover:bg-os-primary-hover"
            disabled={form.formState.isSubmitting}
          >
            <Star size={20} />
            {form.formState.isSubmitting ? 'CRIANDO...' : 'CRIAR'}
            <Star size={20} />
          </Button>
        </div>
      </form>
    </Form>
  )
}