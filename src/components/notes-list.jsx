import { NoteCard } from '@/components/note-card'

function NotesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`note-skeleton-${index}`}
          className="h-72 rounded-xl bg-muted animate-pulse border border-border/40"
        />
      ))}
    </div>
  )
}

export function NotesList({ notes = [], isLoading, emptyMessage = '등록된 필기가 없습니다.' }) {
  if (isLoading) {
    return <NotesSkeleton />
  }

  if (!notes.length) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}

