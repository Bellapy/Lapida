import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const categorySchema = z.object({
  name: z.string().min(1, 'O nome da categoria é obrigatório.'),
})

// Handler para BUSCAR todas as categorias do usuário
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const categories = await db.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('[CATEGORIES_GET_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}

// Handler para CRIAR uma nova categoria
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const body = await req.json()
    const validation = categorySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.flatten().fieldErrors, {
        status: 400,
      })
    }
    
    // Lembre-se que nosso schema Prisma previne nomes duplicados por usuário (@@unique)
    // O Prisma lançará um erro se tentarmos criar uma duplicata, que será pego pelo catch.
    const category = await db.category.create({
      data: {
        name: validation.data.name,
        userId: session.user.id,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    // Tratamento de erro específico para violação de constraint única do Prisma
    if (error.code === 'P2002') {
      return new NextResponse('Uma categoria com este nome já existe.', { status: 409 }) // 409 Conflict
    }

    console.error('[CATEGORIES_POST_ERROR]', error)
    return new NextResponse('Erro Interno do Servidor', { status: 500 })
  }
}