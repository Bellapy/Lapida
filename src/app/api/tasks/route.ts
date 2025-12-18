import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const createTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  date: z.coerce.date({
    required_error: 'A data é obrigatória.',
    invalid_type_error: 'Formato de data inválido.',
  }),
  categoryId: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const tasks = await db.task.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
      include: { category: true },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('[TASKS_GET_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}

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
    
    const { title, description, date, categoryId } = validation.data

    if (categoryId) {
      const categoryExists = await db.category.findFirst({
        where: {
          id: categoryId,
          userId: session.user.id,
        },
      })
      if (!categoryExists) {
        return new NextResponse('Categoria inválida.', { status: 403 })
      }
    }

    const task = await db.task.create({
      data: {
        userId: session.user.id,
        title,
        description,
        date,
        categoryId,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('[TASKS_POST_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}