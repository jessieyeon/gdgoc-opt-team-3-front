import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn, convertGradeToLetter, getGradeColorClass } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function FactCheckResults({ factCheckData }) {
  if (!factCheckData || !factCheckData.report) {
    return null
  }

  const { claims, report } = factCheckData
  const grade = convertGradeToLetter(report.overallAssessment?.grade || 'poor')
  const gradeColorClass = getGradeColorClass(grade)

  return (
    <div className="space-y-4">
      {/* 전체 리포트 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-primary font-bold">✓</span>
            </div>
            사실 검증 결과
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 등급 표시 */}
          <div className={cn('rounded-lg border-2 p-6 text-center', gradeColorClass)}>
            <div className="text-4xl font-bold mb-2">{grade}</div>
            <p className="text-sm font-medium">{report.overallAssessment?.message || '검증 완료'}</p>
          </div>

          <Separator />

          {/* 통계 요약 */}
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{report.summary.accuracy}%</div>
              <div className="text-xs text-muted-foreground">정확도</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{report.summary.correct}</div>
              <div className="text-xs text-muted-foreground">정확</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{report.summary.incorrect}</div>
              <div className="text-xs text-muted-foreground">오류</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{report.summary.partiallyCorrect}</div>
              <div className="text-xs text-muted-foreground">부분 정확</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{report.summary.unclear}</div>
              <div className="text-xs text-muted-foreground">불명확</div>
            </div>
          </div>

          {/* 심각도별 오류 */}
          {report.severity && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">심각도별 오류</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 rounded bg-red-50">
                    <div className="font-bold text-red-600">{report.severity.critical || 0}</div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center p-2 rounded bg-orange-50">
                    <div className="font-bold text-orange-600">{report.severity.major || 0}</div>
                    <div className="text-muted-foreground">Major</div>
                  </div>
                  <div className="text-center p-2 rounded bg-yellow-50">
                    <div className="font-bold text-yellow-600">{report.severity.minor || 0}</div>
                    <div className="text-muted-foreground">Minor</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 주요 이슈 */}
          {report.topIssues && report.topIssues.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">주요 이슈</h4>
                <div className="space-y-2">
                  {report.topIssues.slice(0, 3).map((issue, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'p-3 rounded-lg border text-xs',
                        issue.severity === 'critical' && 'bg-red-50 border-red-200',
                        issue.severity === 'major' && 'bg-orange-50 border-orange-200',
                        issue.severity === 'minor' && 'bg-yellow-50 border-yellow-200'
                      )}
                    >
                      <div className="font-medium mb-1">{issue.text}</div>
                      {issue.correction && (
                        <div className="text-muted-foreground mt-1">
                          <span className="font-medium">수정 제안:</span> {issue.correction}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 주장 목록 */}
      {claims && claims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">검증된 주장 ({claims.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claims.map((claim, idx) => (
                <ClaimItem key={claim.id || idx} claim={claim} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ClaimItem({ claim }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'correct':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'incorrect':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'partially_correct':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'unclear':
        return <HelpCircle className="h-4 w-4 text-gray-600" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getVerdictLabel = (verdict) => {
    switch (verdict) {
      case 'correct':
        return '정확'
      case 'incorrect':
        return '오류'
      case 'partially_correct':
        return '부분 정확'
      case 'unclear':
        return '불명확'
      default:
        return '알 수 없음'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'major':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'minor':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getVerdictIcon(claim.verdict)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium flex-1">{claim.text}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded border',
                  getSeverityColor(claim.severity)
                )}
              >
                {claim.severity || 'info'}
              </span>
              <span className="text-xs text-muted-foreground">
                {getVerdictLabel(claim.verdict)}
              </span>
            </div>
          </div>

          {claim.explanation && (
            <p className="text-xs text-muted-foreground mb-2">{claim.explanation}</p>
          )}

          {claim.correction && (
            <div className="text-xs p-2 rounded bg-blue-50 border border-blue-200 mb-2">
              <span className="font-medium text-blue-700">수정 제안:</span>{' '}
              <span className="text-blue-600">{claim.correction}</span>
            </div>
          )}

          {claim.sources && claim.sources.length > 0 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                출처 {claim.sources.length}개
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {claim.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2 rounded bg-gray-50 border border-gray-200"
                    >
                      <div className="font-medium mb-1">{source.title}</div>
                      {source.excerpt && (
                        <div className="text-muted-foreground mb-1 line-clamp-2">
                          {source.excerpt}
                        </div>
                      )}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          링크 열기
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <div className="text-muted-foreground mt-1 text-xs">
                        {source.type} · {source.reliability} 신뢰도
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

