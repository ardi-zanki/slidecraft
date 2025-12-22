/**
 * Durably テストページ
 *
 * ブラウザ上で Durably (SQLite ベースのワークフローエンジン) を試すためのテストルート
 * クライアントサイドのみで動作
 */
import { createDurably, type Run } from '@coji/durably'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { SQLocalKysely } from 'sqlocal/kysely'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

// Durably インスタンス（シングルトン）
let durably: ReturnType<typeof createDurably> | null = null
let testJob: ReturnType<ReturnType<typeof createDurably>['defineJob']> | null =
  null

function getDurably() {
  if (!durably) {
    console.log('[Durably] Creating SQLocalKysely...')
    const { dialect } = new SQLocalKysely('durably-test.sqlite3')
    console.log('[Durably] SQLocalKysely created, creating durably...')
    durably = createDurably({
      dialect,
      pollingInterval: 100,
      heartbeatInterval: 500,
      staleThreshold: 3000,
    })

    // テスト用ジョブを定義
    testJob = durably.defineJob(
      {
        name: 'test-multi-step',
        input: z.object({ count: z.number() }),
        output: z.object({
          steps: z.array(z.string()),
          total: z.number(),
        }),
      },
      async (step, payload) => {
        const steps: string[] = []

        // ステップ1: 初期化
        const initResult = await step.run('initialize', async () => {
          await sleep(1000) // 1秒待機（処理をシミュレート）
          return `Initialized with count: ${payload.count}`
        })
        steps.push(initResult)

        // ステップ2: カウントアップ（複数回）
        for (let i = 1; i <= payload.count; i++) {
          const result = await step.run(`count-${i}`, async () => {
            await sleep(500) // 0.5秒待機
            return `Step ${i} completed`
          })
          steps.push(result)
        }

        // ステップ3: 完了処理
        const finalResult = await step.run('finalize', async () => {
          await sleep(500)
          return `Finalized at ${new Date().toISOString()}`
        })
        steps.push(finalResult)

        return {
          steps,
          total: steps.length,
        }
      },
    )
  }
  if (!testJob) {
    throw new Error('testJob is not initialized')
  }
  return { durably, testJob }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function DurablyTestPage() {
  const [initialized, setInitialized] = useState(false)
  const [running, setRunning] = useState(false)
  const [currentRun, setCurrentRun] = useState<Run | null>(null)
  const [result, setResult] = useState<{
    steps: string[]
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ])
  }, [])

  // 初期化
  useEffect(() => {
    const init = async () => {
      console.log('[Durably] Starting initialization...')
      try {
        console.log('[Durably] Getting durably instance...')
        const { durably } = getDurably()
        console.log('[Durably] Running migrate...')
        await durably.migrate()
        console.log('[Durably] Starting worker...')
        durably.start()
        setInitialized(true)
        addLog('Durably initialized and started')
        console.log('[Durably] Initialization complete!')

        // イベント購読
        durably.on('run:start', (event) => {
          addLog(`Run started: ${event.runId}`)
        })
        durably.on('step:start', (event) => {
          addLog(`Step started: ${event.stepName}`)
        })
        durably.on('step:complete', (event) => {
          addLog(`Step completed: ${event.stepName}`)
        })
        durably.on('run:complete', (event) => {
          addLog(`Run completed: ${event.runId}`)
        })
        durably.on('run:fail', (event) => {
          addLog(`Run failed: ${event.error}`)
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize')
        addLog(`Error: ${err}`)
      }
    }
    init()

    return () => {
      if (durably) {
        durably.stop()
        addLog('Durably stopped')
      }
    }
  }, [addLog])

  // ジョブ実行
  const runJob = async () => {
    setRunning(true)
    setResult(null)
    setError(null)
    setCurrentRun(null)

    try {
      const { testJob } = getDurably()
      addLog('Starting job with count: 3')

      const { id, output } = await testJob.triggerAndWait({ count: 3 })
      addLog(`Job completed: ${id}`)

      // 実行情報を取得
      const run = await testJob.getRun(id)
      setCurrentRun(run)
      const typedOutput = output as { steps: string[]; total: number }
      setResult(typedOutput)
      addLog(`Total steps: ${typedOutput.total}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Job failed')
      addLog(`Job error: ${err}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Durably テスト</CardTitle>
          <CardDescription>
            ブラウザ上で SQLite ベースのワークフローエンジンを試します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ステータス */}
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${initialized ? 'bg-emerald-500' : 'bg-slate-300'}`}
            />
            <span className="text-sm">
              {initialized ? '初期化完了' : '初期化中...'}
            </span>
          </div>

          {/* 実行ボタン */}
          <Button onClick={runJob} disabled={!initialized || running}>
            {running ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                実行中...
              </>
            ) : (
              'ジョブを実行'
            )}
          </Button>

          {/* 現在の実行情報 */}
          {currentRun && (
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm font-medium">実行ID: {currentRun.id}</p>
              <p className="text-sm text-slate-600">
                ステータス: {currentRun.status}
              </p>
            </div>
          )}

          {/* 結果 */}
          {result && (
            <div className="rounded-md bg-emerald-50 p-4">
              <p className="mb-2 font-medium text-emerald-800">
                完了: {result.total} ステップ
              </p>
              <ul className="space-y-1 text-sm text-emerald-700">
                {result.steps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* ログ */}
          <div className="rounded-md bg-slate-900 p-4">
            <p className="mb-2 text-sm font-medium text-slate-400">ログ</p>
            <div className="max-h-48 space-y-1 overflow-y-auto font-mono text-xs text-slate-300">
              {logs.length === 0 ? (
                <p className="text-slate-500">ログなし</p>
              ) : (
                logs.map((log) => <div key={log}>{log}</div>)
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
