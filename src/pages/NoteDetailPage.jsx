import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/header'
import { NoteViewer } from '@/components/note-viewer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NoteDetailPage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Link>
        </Button>

        <NoteViewer noteId={id} />
      </main>
    </div>
  )
}

