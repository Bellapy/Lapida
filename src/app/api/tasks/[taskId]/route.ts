import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Schema para atualização. Todos os campos são opcionais.
const updateTaskSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.').optional(),
  date: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
})

interface RouteContext {
  params: {
    taskId: string
  }
}

// Handler para ATUALIZAR uma tarefa (PATCH)
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    // 1. Verificar se a tarefa existe e pertence ao usuário
    const taskToUpdate = await db.task.findUnique({
      where: { id: params.taskId },
    })

    if (!taskToUpdate) {
      return new NextResponse('Tarefa não encontrada', { status: 404 })
    }

    if (taskToUpdate.userId !== session.user.id) {
      return new NextResponse('Acesso negado', { status: 403 }) // 403 Forbidden
    }

    // 2. Validar o corpo da requisição
    const body = await req.json()
    const validation = updateTaskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.flatten().fieldErrors, { status: 400 })
    }

    // 3. Atualizar a tarefa
    const updatedTask = await db.task.update({
      where: { id: params.taskId },
      data: validation.data,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('[TASK_PATCH_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}

// Handler para DELETAR uma tarefa (DELETE)
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    // 1. Verificar se a tarefa existe e pertence ao usuário
    const taskToDelete = await db.task.findUnique({
      where: { id: params.taskId },
    })

    if (!taskToDelete) {
      return new NextResponse('Tarefa não encontrada', { status: 404 })
    }

    if (taskToDelete.userId !== session.user.id) {
      return new NextResponse('Acesso negado', { status: 403 })
    }

    // 2. Deletar a tarefa
    await db.task.delete({
      where: { id: params.taskId },
    })

    return new NextResponse(null, { status: 204 }) // 204 No Content é a resposta padrão para delete bem-sucedido
  } catch (error) {
    console.error('[TASK_DELETE_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}