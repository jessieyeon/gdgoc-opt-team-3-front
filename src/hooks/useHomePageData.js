import { useEffect, useState } from 'react'
import { fetchNotes, fetchForYouNotes, fetchTopContributors } from '@/services/api'

export function useHomePageData() {
  const [trendingNotes, setTrendingNotes] = useState([])
  const [personalizedNotes, setPersonalizedNotes] = useState([])
  const [contributors, setContributors] = useState([])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const [trending, personalized, topContributors] = await Promise.all([
          fetchNotes({ sort: 'likes' }).then((data) => data.slice(0, 3)),
          fetchForYouNotes().then((data) => data.slice(0, 3)),
          fetchTopContributors().then((data) => data.slice(0, 3)),
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
  }, [])

  return { trendingNotes, personalizedNotes, contributors }
}

