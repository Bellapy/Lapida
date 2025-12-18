import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const updateTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.').optional(),
  description: z.string().optional().nullable(),
  date: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  categoryId: z.string().optional().nullable(),
})

interface RouteContext {
  params: {
    taskId: string
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const taskToUpdate = await db.task.findUnique({
      where: { id: params.taskId },
    })

    if (!taskToUpdate) {
      return new NextResponse('Tarefa não encontrada', { status: 404 })
    }

    if (taskToUpdate.userId !== session.user.id) {
      return new NextResponse('Acesso negado', { status: 403 })
    }

    const body = await req.json()
    const validation = updateTaskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.flatten().fieldErrors, {
        status: 400,
      })
    }
    
    const dataToUpdate = validation.data
    // Permite desassociar uma categoria
    if (dataToUpdate.categoryId === 'none') {
      dataToUpdate.categoryId = null
    }

    const updatedTask = await db.task.update({
      where: { id: params.taskId },
      data: dataToUpdate,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('[TASK_PATCH_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const taskToDelete = await db.task.findUnique({
      where: { id: params.taskId },
    })

    if (!taskToDelete) {
      return new NextResponse('Tarefa não encontrada', { status: 404 })
    }

    if (taskToDelete.userId !== session.user.id) {
      return new NextResponse('Acesso negado', { status: 403 })
    }

    await db.task.delete({
      where: { id: params.taskId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[TASK_DELETE_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}