import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Download, Bookmark, Share2, Lock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { fetchNoteDetail, interactWithNote } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export function NoteViewer({ noteId }) {
  const [note, setNote] = useState(null)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [dislikesCount, setDislikesCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const canDownload = user?.hasUploaded

  const handleDownload = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }
    if (!canDownload) {
      if (confirm('필기를 1개 이상 업로드해야 다운로드할 수 있습니다.\n업로드 페이지로 이동하시겠습니까?')) {
        window.location.href = '/upload'
      }
      return
    }
    alert('다운로드가 시작됩니다. (데모)')
  }

  useEffect(() => {
    if (!noteId) return
    let active = true
    setIsLoading(true)
    setError(null)
    fetchNoteDetail(noteId)
      .then((data) => {
        if (!active) return
        setNote(data)
        setLikesCount(data.stats?.likes || 0)
        setDislikesCount(data.stats?.dislikes || 0)
        setLiked(false)
        setDisliked(false)
        setBookmarked(false)
      })
      .catch(() => {
        if (!active) return
        setError('필기 상세 정보를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [noteId])

  const handleLike = async () => {
    if (!note) return
    try {
      await interactWithNote(note.id, liked ? 'dislike' : 'like')
      if (liked) {
        setLiked(false)
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        setLiked(true)
        setLikesCount((prev) => prev + 1)
        if (disliked) {
          setDisliked(false)
          setDislikesCount((prev) => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
    }
  }

  const handleDislike = async () => {
    if (!note) return
    try {
      await interactWithNote(note.id, disliked ? 'like' : 'dislike')
      if (disliked) {
        setDisliked(false)
        setDislikesCount((prev) => Math.max(0, prev - 1))
      } else {
        setDisliked(true)
        setDislikesCount((prev) => prev + 1)
        if (liked) {
          setLiked(false)
          setLikesCount((prev) => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('싫어요 처리 실패:', error)
    }
  }

  const handleBookmark = () => {
    if (!note) return
    setBookmarked((prev) => !prev)
  }

  if (isLoading) {
    return <div className="h-[600px] rounded-xl bg-muted animate-pulse" />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
        {error}
      </div>
    )
  }

  if (!note) {
    return null
  }

  const uploader = note.uploader || {}
  const aiSummary = typeof note.aiSummary === 'string'
    ? { summary: note.aiSummary, difficulty: note.difficulty, estimatedTime: note.estimatedTime }
    : note.aiSummary || {}
  const relatedNotes = note.relatedNotes || []

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-grow">
                <CardTitle className="text-2xl text-balance">{note.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                    {note.major || '기타'}
                  </span>
                  {note.professor && <span>{note.professor} 교수님</span>}
                  {note.semester && <span>학기: {note.semester}</span>}
                  {note.createdAt && <span>업로드: {new Date(note.createdAt).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full bg-muted rounded-lg overflow-hidden min-h-[800px]">
              <img
                src={note.thumbnailUrl || '/placeholder.svg'}
                alt="Note content"
                className="w-full h-auto"
              />
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Button
                  variant={liked ? 'default' : 'outline'}
                  className={cn('gap-2', liked && 'bg-primary')}
                  onClick={handleLike}
                >
                  <ThumbsUp className={cn('h-4 w-4', liked && 'fill-current')} />
                  좋아요 ({likesCount})
                </Button>
                <Button
                  variant={disliked ? 'destructive' : 'outline'}
                  className="gap-2"
                  onClick={handleDislike}
                >
                  <ThumbsDown className={cn('h-4 w-4', disliked && 'fill-current')} />
                  ({dislikesCount})
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(bookmarked && 'bg-primary text-primary-foreground')}
                  onClick={handleBookmark}
                >
                  <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleDownload}
                  variant={canDownload ? "default" : "secondary"}
                >
                  {canDownload ? (
                    <Download className="h-4 w-4 mr-2" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  {canDownload ? '다운로드' : '다운로드 잠김'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-primary font-bold">🔍</span>
              </div>
              필기 보기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">핵심 내용</h4>
              <ul className="space-y-2">
                {aiSummary.keyPoints?.length ? (
                  aiSummary.keyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground text-pretty">{point}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground text-sm">AI 요약이 준비 중입니다.</li>
                )}
              </ul>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">난이도</p>
                <p className="font-semibold">{aiSummary.difficulty || '정보 없음'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">예상 학습시간</p>
                <p className="font-semibold">{aiSummary.estimatedTime || '정보 없음'}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 text-sm">전체 요약</h4>
              <p className="text-sm text-muted-foreground text-pretty">{aiSummary.summary || note.summary}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">업로더 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary overflow-hidden">
                <img
                  src={uploader?.avatarUrl || '/placeholder-user.jpg'}
                  alt={uploader?.username || 'uploader avatar'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{uploader?.displayId || 'Unknown'}</p>
                {uploader?.id && <p className="text-sm text-muted-foreground">ID: {uploader.id}</p>}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/notes">업로더의 다른 필기 보기</Link>
            </Button>
          </CardContent>
        </Card>

        {relatedNotes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">연관된 필기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatedNotes.map((related) => (
                <Link
                  key={related.id}
                  to={`/notes/${related.id}`}
                  className="flex flex-col rounded-lg border p-3 hover:border-primary/50 transition-colors"
                >
                  <p className="font-semibold text-sm text-foreground">{related.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {related.subject} · {related.professor} 교수님
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

