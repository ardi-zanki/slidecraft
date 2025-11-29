import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '~/generated/prisma/client'

const LOCAL_DATABASE_URL = 'file:./data/local.db'

// Prisma 7ではドライバーアダプターが必須
// libsql://（Turso）と file:（ローカルSQLite）の両方に対応
const databaseUrl = process.env.DATABASE_URL ?? LOCAL_DATABASE_URL
const isTurso = databaseUrl.startsWith('libsql://')

const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: isTurso ? process.env.DATABASE_AUTH_TOKEN : undefined,
})

export const prisma = new PrismaClient({ adapter })
