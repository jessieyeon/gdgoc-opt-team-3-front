import { useEffect, useState } from 'react'
import { fetchForYouNotes, fetchTopContributors, fetchTrendingNotes } from '@/services/mockApi'

export function useHomePageData(studentId) {
  const [trendingNotes, setTrendingNotes] = useState([])
  const [personalizedNotes, setPersonalizedNotes] = useState([])
  const [contributors, setContributors] = useState([])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const [trending, personalized, topContributors] = await Promise.all([
          fetchTrendingNotes(3),
          studentId ? fetchForYouNotes(studentId, 3) : Promise.resolve([]),
          fetchTopContributors(3),
        ])

        if (!mounted) return

        setTrendingNotes(trending)
        setPersonalizedNotes(personalized)
        setContributors(topContributors)
      } catch (error) {
        if (!mounted) return
        setTrendingNotes([])
        setPersonalizedNotes([])
        setContributors([])
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [studentId])

  return { trendingNotes, personalizedNotes, contributors }
}

