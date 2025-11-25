import { ExternalLink, Key, Lock } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/api-key-setup'
import { GuideHeader } from './_layout'

export function meta(): Route.MetaDescriptors {
  const title = 'Google AI Studio APIキー取得ガイド | SlideCraft'
  const description =
    'SlideCraftで使用するGoogle Gemini APIキーの取得方法を5分で理解できるステップバイステップガイド。クレジットカード登録、無料枠、セキュリティについて解説。'
  const url = 'https://www.slidecraft.work/guides/api-key-setup'

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: 'https://www.slidecraft.work/ogp-image.jpg' },
    {
      property: 'og:image:alt',
      content: 'SlideCraft - APIキー取得ガイド',
    },
  ]
}

export default function ApiKeySetupGuide() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <GuideHeader />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                APIキー取得ガイド
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                所要時間: 約5分 / Google AI Studio
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          {/* Why */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              なぜAPIキーが必要なのか
            </h2>
            <p className="leading-relaxed text-slate-600">
              SlideCraftは、スライド画像の生成にGoogle
              Geminiという最先端のAIモデルを使用しています。このAIはGoogleが提供するクラウドサービスであり、利用するためには認証情報としてAPIキーが必要です。
            </p>
            <p className="leading-relaxed text-slate-600">
              SlideCraft自体は無料ですが、Gemini
              APIの利用料は直接Googleから請求されます。これにより、あなたのデータは第三者のサービスを経由せず、Googleとあなたのブラウザだけでやり取りされるため、セキュリティとプライバシーが保たれます。
            </p>
          </section>

          {/* What you need */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              準備するもの
            </h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-500">●</span>
                  <span>Googleアカウント（Gmailアドレス）- 既存のものでOK</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-500">●</span>
                  <span>
                    クレジットカード - 有料モデル利用のため請求先登録が必要
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-500">●</span>
                  <span>約5分の時間</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Steps */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">取得手順</h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Google AI Studioにアクセス
                  </h3>
                </div>
                <p className="mb-4 text-slate-600">
                  以下のリンクからGoogle AI
                  Studioを開き、Googleアカウントでログインします。
                </p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google AI Studioを開く
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    利用規約に同意（初回のみ）
                  </h3>
                </div>
                <p className="mb-3 text-slate-600">
                  初めて利用する場合、利用規約（Terms of
                  Service）への同意が求められます。
                </p>
                <div className="rounded-md bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>新規ユーザーの方へ:</strong>{' '}
                    利用規約に同意すると、Google AI
                    Studioが自動的にデフォルトのGoogle Cloud ProjectとAPI
                    Keyを作成します。すぐに使い始められます。
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    APIキーの確認・管理
                  </h3>
                </div>
                <p className="mb-3 text-slate-600">
                  左側パネルの「Dashboard」から「API
                  Keys」ページを開きます。自動作成されたAPIキーが表示されています。
                </p>
                <p className="text-sm text-slate-600">
                  既存のGoogle Cloudユーザーの場合は、「Import
                  projects」ボタンから既存プロジェクトをインポートして、そこに新しいAPIキーを作成することもできます。
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    請求先アカウントの設定
                  </h3>
                </div>
                <p className="mb-3 text-slate-600">
                  Gemini 3 Pro Image (Nano Banana
                  Pro)は有料モデルのため、クレジットカード情報の登録が必要です。
                </p>
                <ul className="mb-3 space-y-2 text-sm text-slate-600">
                  <li>● Google Cloud Consoleの「お支払い」セクションを開く</li>
                  <li>
                    ● 請求先アカウントを作成し、クレジットカード情報を登録
                  </li>
                  <li>
                    ●
                    プロジェクトと請求先アカウントをリンク（自動的に行われる場合もあります）
                  </li>
                </ul>
                <div className="rounded-md bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    <strong>注意:</strong>{' '}
                    利用した分だけ料金が発生します。1スライド修正あたり約20円です。
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    5
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    APIキーをコピー
                  </h3>
                </div>
                <p className="mb-3 text-slate-600">
                  Google AI
                  Studioに戻り、表示されたAPIキー（`AIza...`で始まる長い文字列）をコピーします。
                </p>
                <div className="rounded-md bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <Lock className="mr-2 inline h-4 w-4" />
                    このAPIキーは他人に見せないでください。GitHubなどの公開リポジトリにもアップロードしないよう注意してください。
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    6
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    SlideCraftに設定
                  </h3>
                </div>
                <p className="mb-4 text-slate-600">
                  SlideCraftのプロジェクト画面で、コピーしたAPIキーを入力します。APIキーはブラウザのlocalStorageに安全に保存され、外部サーバーには送信されません。
                </p>
                <Button asChild>
                  <Link to="/projects/new">今すぐ設定する</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              料金について
            </h2>
            <p className="mb-4 leading-relaxed text-slate-600">
              Google AI
              Studio自体は無料で利用できます。ただし、SlideCraftで使用するGemini
              3 Pro Image (Nano Banana
              Pro)は有料プレビューモデルのため、利用には料金が発生します。
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <h4 className="mb-3 font-bold text-amber-900">
                Gemini 3 Pro Image (Nano Banana Pro) の料金
              </h4>
              <div className="space-y-3 text-sm text-amber-800">
                <p>
                  SlideCraftで使用する Gemini 3 Pro Image (Nano Banana Pro) は、
                  <strong>有料プレビュー（Paid Preview）</strong>
                  として提供されており、
                  <strong>無料枠では利用できません</strong>。
                </p>
                <div className="rounded-md bg-white p-4">
                  <p className="mb-2 font-bold text-slate-900">
                    実際の利用料金:
                  </p>
                  <p className="text-slate-700">
                    1スライド修正あたり約20円（為替レートにより変動）
                  </p>
                </div>
                <p>
                  ただし、APIの利用制限（1日1500リクエスト、1分15リクエスト）は適用されるため、使いすぎを防ぐことができます。
                </p>
                <p className="mt-4 text-xs">
                  ※ 最新の料金情報は
                  <a
                    href="https://ai.google.dev/gemini-api/docs/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-600"
                  >
                    Googleの公式ドキュメント
                  </a>
                  をご確認ください。予告なく変更される場合があります。
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              よくある問題
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="mb-2 font-bold text-slate-900">
                  「APIキーが無効です」と表示される
                </h4>
                <p className="text-sm text-slate-600">
                  APIキーのコピーミスが考えられます。前後にスペースが入っていないか、全文字が正しくコピーされているか確認してください。
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="mb-2 font-bold text-slate-900">
                  既存のGoogle Cloudプロジェクトを使いたい
                </h4>
                <p className="text-sm text-slate-600">
                  Google AI Studioのダッシュボードから「Projects」→「Import
                  projects」を選択し、既存のGoogle
                  Cloudプロジェクトを検索・インポートできます。インポート後、そのプロジェクトにAPIキーを作成できます。
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-8 text-center">
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              APIキーの準備ができたら
            </h3>
            <p className="mb-6 text-slate-600">
              早速SlideCraftでスライドを修正してみましょう。
            </p>
            <Button asChild size="lg">
              <Link to="/projects/new">プロジェクトを開始する</Link>
            </Button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>
            その他のご質問は
            <Link to="/#faq" className="text-blue-600 hover:underline">
              FAQ
            </Link>
            をご覧ください
          </p>
        </div>
      </footer>
    </div>
  )
}
