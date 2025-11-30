import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Download, Bookmark, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function NoteCard({ note }) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likesCount, setLikesCount] = useState(note.likes)
  const [dislikesCount, setDislikesCount] = useState(note.dislikes)
  const [bookmarked, setBookmarked] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()

    if (liked) {
      setLiked(false)
      setLikesCount((prev) => prev - 1)
    } else {
      setLiked(true)
      setLikesCount((prev) => prev + 1)
      if (disliked) {
        setDisliked(false)
        setDislikesCount((prev) => prev - 1)
      }
    }
  }

  const handleDislike = (e) => {
    e.preventDefault()

    if (disliked) {
      setDisliked(false)
      setDislikesCount((prev) => prev - 1)
    } else {
      setDisliked(true)
      setDislikesCount((prev) => prev + 1)
      if (liked) {
        setLiked(false)
        setLikesCount((prev) => prev - 1)
      }
    }
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    setBookmarked((prev) => !prev)
  }

  return (
    <Link to={`/notes/${note.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative h-48 w-full bg-muted">
          <img
            src={note.thumbnailUrl || '/placeholder.svg'}
            alt={note.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            AI 요약
          </div>
        </div>

        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {note.subject}
            </span>
            <span className="text-xs text-muted-foreground">{note.professor}</span>
          </div>
          <h3 className="font-semibold leading-tight line-clamp-2 text-balance">
            {note.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">
            {note.summary}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 transition-colors',
                liked ? 'text-primary' : 'text-muted-foreground hover:text-primary',
              )}
            >
              <ThumbsUp className={cn('h-4 w-4', liked && 'fill-current')} />
              <span className="font-medium">{likesCount}</span>
            </button>
            <button
              onClick={handleDislike}
              className={cn(
                'flex items-center gap-1 transition-colors',
                disliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive',
              )}
            >
              <ThumbsDown className={cn('h-4 w-4', disliked && 'fill-current')} />
              <span className="font-medium">{dislikesCount}</span>
            </button>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={cn('h-8 w-8', bookmarked && 'text-primary')}
              onClick={handleBookmark}
            >
              <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => e.preventDefault()}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

