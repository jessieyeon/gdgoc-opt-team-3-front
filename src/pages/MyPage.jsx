import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/header'
import { MyPageTabs } from '@/components/my-page-tabs'
import { useAuth } from '@/context/AuthContext.jsx'

export default function MyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-3xl font-bold">{(user.username || 'Y')[0]}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.username || '마이페이지'}</h1>
              <p className="text-muted-foreground">아이디: @{user.username}</p>
            </div>
          </div>

          <MyPageTabs />
        </div>
      </main>
    </div>
  )
}

