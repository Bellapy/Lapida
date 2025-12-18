'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { Star } from 'lucide-react'

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

const taskSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  date: z.string().min(1, 'A data é obrigatória.'),
})

export function CreateTaskForm() {
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { description: '', date: '' },
  })

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: values.description,
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