import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/services/api'
import { useAuth } from '@/context/AuthContext.jsx'

export default function LoginPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
    if (!emailRegex.test(email)) {
      toast({
        title: '이메일 형식 오류',
        description: '연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    setLoginLoading(true)
    login({ email, password })
      .then((response) => {
        setUser(response.user)
        setToken(response.token)
        toast({
          title: '로그인 성공',
          description: '필기 업로드와 맞춤 추천을 이용할 수 있어요.',
        })
        navigate('/', { replace: true })
      })
      .catch((err) => {
        toast({
          title: '로그인 실패',
          description: err.message || '계정을 확인해주세요.',
          variant: 'destructive',
        })
      })
      .finally(() => setLoginLoading(false))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <span className="font-bold text-3xl text-primary-foreground">Y</span>
          </div>
          <CardTitle className="text-2xl font-bold">연세 노트 로그인</CardTitle>
          <CardDescription>연세 이메일과 비밀번호로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">연세 이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@yonsei.ac.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loginLoading}>
              {loginLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground mb-2">연세대학교 학생 전용 서비스입니다</p>
            <p className="text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

