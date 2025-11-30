import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Upload, TrendingUp, Sparkles, Users, Star } from 'lucide-react'
import { fetchForYouNotes, fetchTopContributors, fetchTrendingNotes } from '@/services/mockApi'
import { useAuth } from '@/context/AuthContext.jsx'

function CurationCard({ icon, title, description, action, actionHref, highlights = [] }) {
  return (
    <div className="group flex flex-col p-6 rounded-lg bg-card border hover:border-primary/50 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors" style={{ backgroundColor: '#e8f0f7' }}>
          {icon}
        </div>
        <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty mb-4 flex-1">{description}</p>
      <div className="space-y-2 mb-4 text-sm">
        {highlights.length ? (
          highlights.slice(0, 3).map((text, index) => (
            <p key={`${title}-${index}`} className="flex gap-2 text-muted-foreground">
              <span className="font-semibold" style={{ color: '#0f4a84' }}>
                {index + 1}.
              </span>
              <span className="text-left flex-1">{text}</span>
            </p>
          ))
        ) : (
          <p className="text-muted-foreground">데이터를 불러오는 중입니다...</p>
        )}
      </div>
      <Link to={actionHref} className="text-sm font-medium group-hover:underline" style={{ color: '#0f4a84' }}>
        {action} →
      </Link>
    </div>
  )
}

export default function HomePage() {
  const [trendingNotes, setTrendingNotes] = useState([])
  const [personalizedNotes, setPersonalizedNotes] = useState([])
  const [contributors, setContributors] = useState([])
  const { user } = useAuth()
  const studentId = user?.studentId || '2023123456'

  useEffect(() => {
    let mounted = true
    Promise.all([fetchTrendingNotes(3), fetchForYouNotes(studentId, 3), fetchTopContributors(3)])
      .then(([trending, personalized, topContributors]) => {
        if (!mounted) return
        setTrendingNotes(trending)
        setPersonalizedNotes(personalized)
        setContributors(topContributors)
      })
      .catch(() => {
        if (!mounted) return
        setTrendingNotes([])
        setPersonalizedNotes([])
        setContributors([])
      })
    return () => {
      mounted = false
    }
  }, [studentId])

  const trendingHighlights = trendingNotes.map((note) => `${note.title} · 👍 ${note.likes}`)
  const personalizedHighlights = personalizedNotes.map(
    (note) => `${note.title} · ${note.subject}`,
  )
  const contributorHighlights = contributors.map(
    (user) => `${user.username} · ${user.uploads}개 업로드`,
  )

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Share. Learn. <span style={{ color: '#0f4a84' }}>Grow Together.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            연세대학교 학생들을 위한 필기 공유 플랫폼에서 함께 공부하고 성장하세요
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild className="!bg-[#0f4a84] hover:!bg-[#0f4a84]/90 text-white">
              <Link to="/notes" className="text-white">
                <BookOpen className="mr-2 h-5 w-5 text-white" />
                필기 둘러보기
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/upload">
                <Upload className="mr-2 h-5 w-5" />
                필기 업로드
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">맞춤형 필기 큐레이션</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              당신의 학습 패턴을 분석하여 가장 필요한 필기를 추천해드립니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <CurationCard
              icon={<TrendingUp className="h-6 w-6" style={{ color: '#0f4a84' }} />}
              title="Trending Notes"
              description="좋아요를 가장 많이 받은 필기를 한눈에 확인하세요"
              action="인기 필기 보기"
              actionHref="/notes"
              highlights={trendingHighlights}
            />
            <CurationCard
              icon={<Star className="h-6 w-6" style={{ color: '#0f4a84' }} />}
              title="For You"
              description="학번 기반 전공 정보를 분석해 맞춤 필기를 추천해요"
              action="맞춤 필기 보기"
              actionHref="/notes"
              highlights={personalizedHighlights}
            />
            <CurationCard
              icon={<Users className="h-6 w-6" style={{ color: '#0f4a84' }} />}
              title="Top Contributors"
              description="가장 많은 필기를 공유한 학생들을 만나보세요"
              action="기여자 보기"
              actionHref="/my-page"
              highlights={contributorHighlights}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

