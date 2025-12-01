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
import { signup } from '@/services/api'

export default function RegisterPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [registerValues, setRegisterValues] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [registerLoading, setRegisterLoading] = useState(false)

  const handleRegisterChange = (field, value) => {
    setRegisterValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = (e) => {
    e.preventDefault()

    if (!registerValues.email || !registerValues.password || !registerValues.username) {
      toast({
        title: '입력 항목을 확인해주세요',
        description: '모든 항목을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@yonsei\.ac\.kr$/
    if (!emailRegex.test(registerValues.email)) {
      toast({
        title: '이메일 형식 오류',
        description: '연세대학교 이메일(@yonsei.ac.kr)을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    setRegisterLoading(true)
    signup(registerValues)
      .then(() => {
        toast({
          title: '회원가입 완료',
          description: '로그인 페이지로 이동합니다.',
        })
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 1000)
      })
      .catch((err) => {
        toast({
          title: '회원가입 실패',
          description: err.message || '입력 정보를 다시 확인해주세요.',
          variant: 'destructive',
        })
      })
      .finally(() => setRegisterLoading(false))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <span className="font-bold text-3xl text-primary-foreground">Y</span>
          </div>
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>연세 노트 계정을 만들어보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">연세 이메일 *</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="username@yonsei.ac.kr"
                value={registerValues.email}
                onChange={(e) => handleRegisterChange('email', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                * 연세대학교 이메일(@yonsei.ac.kr)만 사용 가능합니다.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">비밀번호 *</Label>
              <Input
                id="register-password"
                type="password"
                value={registerValues.password}
                onChange={(e) => handleRegisterChange('password', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-username">아이디 *</Label>
              <Input
                id="register-username"
                placeholder="my_id_123"
                value={registerValues.username}
                onChange={(e) => handleRegisterChange('username', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                * 필기 상세페이지와 Top Contributors에 표시될 아이디입니다.
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={registerLoading}>
              {registerLoading ? '등록 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

