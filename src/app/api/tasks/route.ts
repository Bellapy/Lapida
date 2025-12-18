import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Schema Zod para a criação de uma nova tarefa, agora com categoryId
const createTaskSchema = z.object({
  description: z
    .string()
    .min(1, 'A descrição não pode estar vazia.')
    .max(200, 'A descrição deve ter no máximo 200 caracteres.'),
  date: z.coerce.date({
    required_error: 'A data é obrigatória.',
    invalid_type_error: 'Formato de data inválido.',
  }),
  categoryId: z.string().optional(), // categoryId é uma string opcional
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
        userId: session.user.id 
      },
      orderBy: {
        date: 'asc', // Ordena as tarefas pela data
      },
      include: {
        category: true, // Inclui os dados da categoria relacionada na resposta
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
    const validation = createTaskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.flatten().fieldErrors, {
        status: 400,
      })
    }
    
    const { description, date, categoryId } = validation.data

    // Se um categoryId foi fornecido, verifica se ele pertence ao usuário
    if (categoryId) {
      const categoryExists = await db.category.findFirst({
        where: {
          id: categoryId,
          userId: session.user.id,
        },
      });
      if (!categoryExists) {
        return new NextResponse('Categoria inválida ou não pertence a este usuário', { status: 403 });
      }
    }

    const task = await db.task.create({
      data: {
        userId: session.user.id,
        description,
        date,
        // Conecta à categoria se o ID for fornecido e válido
        categoryId: categoryId,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('[TASKS_POST_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}