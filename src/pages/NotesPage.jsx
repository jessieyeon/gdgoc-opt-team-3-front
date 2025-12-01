import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { NotesList } from '@/components/notes-list'
import { SubjectFilter } from '@/components/subject-filter'
import { fetchNotes } from '@/services/api'

export default function NotesPage() {
  const [subjects, setSubjects] = useState(['전체'])
  const [selectedSubject, setSelectedSubject] = useState('전체')
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)

    const loadNotes = async () => {
      try {
        const data = await fetchNotes({
          sort: 'latest',
          category: selectedSubject === '전체' ? undefined : selectedSubject,
        })

        if (!active) return

        // 카테고리 목록 추출 (첫 로드 시)
        if (subjects.length === 1 && data.length > 0) {
          const categories = ['전체', ...new Set(data.map((note) => note.major).filter(Boolean))]
          setSubjects(categories)
        }

        setNotes(data)
      } catch (err) {
        if (!active) return
        setError('필기 목록을 불러오지 못했습니다.')
        setNotes([])
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadNotes()

    return () => {
      active = false
    }
  }, [selectedSubject, subjects.length])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">필기 둘러보기</h1>
            <p className="text-muted-foreground">과목별로 공유된 필기를 찾아보세요</p>
          </div>

          <SubjectFilter subjects={subjects} selected={selectedSubject} onSelect={setSelectedSubject} />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-4 py-2">
              {error}
            </p>
          )}

          <NotesList notes={notes} isLoading={isLoading} emptyMessage="조건에 맞는 필기가 없습니다." />
        </div>
      </main>
    </div>
  )
}

