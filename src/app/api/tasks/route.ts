import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Schema Zod para a criação de uma nova tarefa
const createTaskSchema = z.object({
  description: z
    .string()
    .min(1, 'A descrição não pode estar vazia.')
    .max(200, 'A descrição deve ter no máximo 200 caracteres.'),
  date: z.string().datetime(), // Esperamos a data no formato ISO 8601 string
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
    return new NextResponse('Erro interno do servidor', { status: 500 })
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
    const { description, date } = createTaskSchema.parse(body)

    const task = await db.task.create({
      data: {
        userId: session.user.id,
        description,
        date: new Date(date), // Converte a string de data para um objeto Date
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.flatten().fieldErrors), {
        status: 400,
      })
    }
    console.error('[TASKS_POST_ERROR]', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
}