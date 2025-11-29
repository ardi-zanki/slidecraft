/**
 * Upstash Redisを使用したレート制限
 *
 * 環境変数:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST Token
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// 環境変数がない場合はnullを返す（開発環境でのスキップ用）
// 本番環境では環境変数が必須
function createRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Upstash Redis credentials (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) are required in production',
      )
    }
    // 開発環境ではレート制限をスキップ
    return null
  }

  const redis = new Redis({ url, token })

  return new Ratelimit({
    redis,
    // 1分間に30リクエストまで（スライディングウィンドウ）
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'ratelimit:usage-log',
  })
}

const rateLimiter = createRateLimiter()

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * レート制限をチェック
 * @param identifier ユーザーIDまたはIPアドレス
 * @returns レート制限結果（環境変数未設定時は常にsuccess: true）
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  if (!rateLimiter) {
    // レート制限が無効な場合は常に許可
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    }
  }

  try {
    const result = await rateLimiter.limit(identifier)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    // Redis障害時はfail-open（リクエストを許可）
    console.error('Rate limit check failed, allowing request:', error, {
      identifier,
    })
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    }
  }
}
