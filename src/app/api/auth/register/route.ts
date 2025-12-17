import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// MODIFICATION START - O import agora funcionará corretamente
import { db } from '@/lib/db'
// MODIFICATION END

const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = userSchema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse('Usuário já existe', { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    }, { status: 201 })

  } catch (error) {
    // MODIFICATION START - Tratamento de erro do Zod melhorado
    if (error instanceof z.ZodError) {
      // O .flatten() cria um objeto com os erros formatados por campo.
      // Isso é muito mais útil para o frontend.
      return new NextResponse(JSON.stringify(error.flatten().fieldErrors), {
        status: 400,
      })
    }
    // MODIFICATION END

    console.error('[AUTH_REGISTER_ERROR]', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
}