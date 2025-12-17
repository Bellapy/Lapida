import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Declara uma variável global para o PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!

// Cria um pool de conexões com o banco de dados PostgreSQL.
// O pool gerencia múltiplas conexões, o que é mais eficiente para ambientes serverless.
const pool = new Pool({ connectionString })

// O adapter faz a ponte entre o Prisma Client e o pool de conexões.
const adapter = new PrismaPg(pool)

// Cria a instância do PrismaClient usando o adapter.
// A lógica do singleton (global.prisma) é mantida para evitar a recriação do pool
// em ambiente de desenvolvimento com hot-reloading.
const db =
  global.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db
}

export { db }