import { ArrowLeft } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export function GuideHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    // React Router経由で遷移してきた場合、遷移元のパスに戻る
    const from = location.state?.from
    if (from) {
      navigate(from)
    } else {
      // 直接アクセスまたは外部リンクの場合はLPへ
      navigate('/')
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
      <ArrowLeft className="mr-2 h-4 w-4" />
      戻る
    </Button>
  )
}

export default function GuidesLayout() {
  return <Outlet />
}
