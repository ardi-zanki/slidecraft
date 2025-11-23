import { RotateCcw } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface PreviewHeaderProps {
  slideNumber: number
  totalSlides: number
  isEdited: boolean
  onResetToOriginal: () => void
}

/**
 * プレビューヘッダーコンポーネント
 *
 * スライド番号の表示と「元に戻す」ボタンを提供
 */
export function PreviewHeader({
  slideNumber,
  totalSlides,
  isEdited,
  onResetToOriginal,
}: PreviewHeaderProps) {
  return (
    <div className="flex h-8 items-center justify-between border-b border-slate-200 bg-white px-4">
      <h1 className="text-xs font-semibold text-slate-800">
        スライド {slideNumber} / {totalSlides}
      </h1>

      {isEdited && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetToOriginal}
          className="text-sm font-medium"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          元に戻す
        </Button>
      )}
    </div>
  )
}
