"use client"
import { useEffect, useState, useRef } from "react"
import GreetSection from "@/components/homePage/greetSection/greetSection"
import ExploreCategories from "@/components/homePage/exploreCategories/exploreCategories"
import PopularEvents from "@/components/homePage/upcomingEvents/popularEvents"
import OnlineEvents from "@/components/homePage/onlineEvents/onlineEvents"
import TrendingEvents from "@/components/homePage/trendingEvents/trendingEvents"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [trendingList, setTrendingList] = useState<{
    foundEvents: any[]
    countryList: any[]
    isLimit: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasRedirected = useRef(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return
    hasFetched.current = true

    async function fetchTrendingEvents() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/trendingWorldEvents?page=6`, {
          credentials: 'include',
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId))

        if (!response.ok) {
          // If unauthorized, redirect to login (only once)
          if ((response.status === 401 || response.status === 440) && !hasRedirected.current) {
            hasRedirected.current = true
            window.location.href = '/' // Use window.location instead of router.push to prevent re-renders
            return
          }
          // For other errors, show empty state
          setTrendingList({ foundEvents: [], countryList: [], isLimit: true })
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setTrendingList({
          foundEvents: data?.foundEvents || [],
          countryList: data?.countryList || [],
          isLimit: data?.isLimit || false
        })
        setIsLoading(false)
      } catch (err: unknown) {
        // Don't redirect on network errors, just show empty state
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Request timed out')
        } else {
          console.error('Error loading home page:', err)
        }
        setTrendingList({ foundEvents: [], countryList: [], isLimit: true })
        setIsLoading(false)
        setError('Failed to load events')
      }
    }

    fetchTrendingEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center min-h-[450px]">
        <p className="text-[24px] text-[#2D2C3C] font-semibold">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start justify-start min-h-screen">
      <GreetSection countryList={trendingList?.countryList || []} />
      <div className="flex flex-col justify-start items-start px-32 w-full">
        <ExploreCategories />
        <div className="flex flex-col justify-start items-start gap-32 w-full">
          <TrendingEvents trendingList={trendingList?.foundEvents || []} isLimit={trendingList?.isLimit || true} />
          <PopularEvents />
          <OnlineEvents />
        </div>
      </div>
    </div>
  )
}
