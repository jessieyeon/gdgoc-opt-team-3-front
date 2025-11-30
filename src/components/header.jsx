import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search, Upload, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext.jsx'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f4a84]">
              <span className="font-bold text-lg text-white">Y</span>
            </div>
            <span className="font-bold text-xl text-[#0f4a84]">연세 노트</span>
          </Link>

          <div className="hidden md:flex relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="과목명, 교수님, 키워드로 검색..." className="pl-10" />
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant="default" size="sm" asChild className="bg-[#0f4a84] hover:bg-[#0f4a84]/90 text-white">
                <Link to="/my-page" className="text-white">
                  <User className="h-4 w-4 mr-2 text-white" />
                  마이페이지
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild className="bg-[#0f4a84] hover:bg-[#0f4a84]/90 text-white">
              <Link to="/login" className="text-white">
                <User className="h-4 w-4 mr-2 text-white" />
                로그인/회원가입
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

