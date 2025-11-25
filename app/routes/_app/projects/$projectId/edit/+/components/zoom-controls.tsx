import { Maximize2, Minus, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ZoomControlsProps {
  scale: number
  position: { x: number; y: number }
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
}

/**
 * ズームコントロールコンポーネント
 *
 * 画像のズームイン/アウトとビューリセット機能を提供する
 * プレビュー画面の右下にオーバーレイ表示される
 */
export function ZoomControls({
  scale,
  position,
  onZoomIn,
  onZoomOut,
  onResetView,
}: ZoomControlsProps) {
  const isResetDisabled = scale === 1 && position.x === 0 && position.y === 0

  return (
    <div className="absolute right-6 bottom-6 flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        disabled={scale <= 0.5}
        className="h-8 w-8 p-0"
        title="ズームアウト"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[3rem] text-center text-xs text-slate-600">
        {Math.round(scale * 100)}%
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        disabled={scale >= 3}
        className="h-8 w-8 p-0"
        title="ズームイン"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetView}
        disabled={isResetDisabled}
        className="h-8 w-8 p-0"
        title="ビューをリセット"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
