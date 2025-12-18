import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Schema Zod para a criação de uma nova tarefa com validação de data corrigida
const createTaskSchema = z.object({
  description: z
    .string()
    .min(1, 'A descrição não pode estar vazia.')
    .max(200, 'A descrição deve ter no máximo 200 caracteres.'),
  date: z.coerce
    .date() // z.coerce.date tenta converter string para Date
    .refine(
      (date) => !isNaN(date.getTime()),
      'A data é obrigatória.'
    ),
})

// Handler para buscar as tarefas (GET)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const tasks = await db.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'asc', // Ordena as tarefas pela data
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('[TASKS_GET_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}

// Handler para criar uma nova tarefa (POST)
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const body = await req.json()
    
    // Usar safeParse para um tratamento de erro mais seguro
    const validation = createTaskSchema.safeParse(body)

    if (!validation.success) {
      // Retorna os erros de forma estruturada para o frontend
      return NextResponse.json(validation.error.flatten().fieldErrors, {
        status: 400,
      })
    }
    
    const { description, date } = validation.data

    const task = await db.task.create({
      data: {
        userId: session.user.id,
        description,
        date, // A data já é um objeto Date graças ao z.coerce.date
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    // Este catch agora lida com erros inesperados do servidor ou do banco de dados
    console.error('[TASKS_POST_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}
