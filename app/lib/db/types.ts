import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

// User table
export interface UserTable {
  id: string
  name: string
  email: string
  emailVerified: number // SQLite uses 0/1 for boolean
  image: string | null
  createdAt: Generated<string>
  updatedAt: Generated<string>
  isAnonymous: number // SQLite uses 0/1 for boolean
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

// Session table
export interface SessionTable {
  id: string
  expiresAt: string
  token: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

export type Session = Selectable<SessionTable>
export type NewSession = Insertable<SessionTable>
export type SessionUpdate = Updateable<SessionTable>

// Account table
export interface AccountTable {
  id: string
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: string | null
  refreshTokenExpiresAt: string | null
  scope: string | null
  password: string | null
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Account = Selectable<AccountTable>
export type NewAccount = Insertable<AccountTable>
export type AccountUpdate = Updateable<AccountTable>

// Verification table
export interface VerificationTable {
  id: string
  identifier: string
  value: string
  expiresAt: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Verification = Selectable<VerificationTable>
export type NewVerification = Insertable<VerificationTable>
export type VerificationUpdate = Updateable<VerificationTable>

// API Usage Log table
export interface ApiUsageLogTable {
  id: string
  createdAt: Generated<string>
  userId: string | null
  operation: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
  costJpy: number
  exchangeRate: number
  metadata: string | null
}

export type ApiUsageLog = Selectable<ApiUsageLogTable>
export type NewApiUsageLog = Insertable<ApiUsageLogTable>
export type ApiUsageLogUpdate = Updateable<ApiUsageLogTable>

// Database schema
export interface Database {
  user: UserTable
  session: SessionTable
  account: AccountTable
  verification: VerificationTable
  apiUsageLog: ApiUsageLogTable
}
