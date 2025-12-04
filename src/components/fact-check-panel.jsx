import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FactCheckResults } from '@/components/fact-check-results'
import { factCheckNote } from '@/services/api'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function FactCheckPanel({ noteContent, subject }) {
  const [isLoading, setIsLoading] = useState(false)
  const [factCheckData, setFactCheckData] = useState(null)
  const [error, setError] = useState(null)

  const handleFactCheck = async () => {
    if (!noteContent || noteContent.trim().length < 100) {
      setError('노트 내용이 부족합니다. 최소 100자 이상의 내용이 필요합니다.')
      return
    }

    setIsLoading(true)
    setError(null)
    setFactCheckData(null)

    try {
      const result = await factCheckNote({
        noteContent,
        subject,
        checkAll: false, // 우선순위가 높은 주장만 검증
      })
      setFactCheckData(result)
    } catch (err) {
      console.error('Fact-check error:', err)
      setError(err.message || '사실 검증 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-primary font-bold">🔍</span>
          </div>
          사실 검증
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!factCheckData && !isLoading && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              AI가 노트의 내용을 검증하여 정확성을 확인합니다. 검증에는 30-60초 정도 소요될 수 있습니다.
            </p>
            <Button
              onClick={handleFactCheck}
              disabled={!noteContent || noteContent.trim().length < 100}
              className="w-full"
            >
              사실 검증 시작
            </Button>
            {(!noteContent || noteContent.trim().length < 100) && (
              <p className="text-xs text-muted-foreground">
                노트 내용이 부족하여 검증할 수 없습니다.
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              사실 검증 중입니다...
              <br />
              <span className="text-xs">잠시만 기다려주세요.</span>
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">오류 발생</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                setError(null)
                setFactCheckData(null)
              }}
            >
              다시 시도
            </Button>
          </div>
        )}

        {factCheckData && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                검증 완료
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFactCheckData(null)
                  setError(null)
                }}
              >
                다시 검증
              </Button>
            </div>
            <Separator />
            <FactCheckResults factCheckData={factCheckData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

