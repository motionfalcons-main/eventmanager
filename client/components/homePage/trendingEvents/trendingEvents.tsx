"use client"
import { useState, useEffect, useRef } from "react"
import EventsSection from "../upcomingEvents/eventsSection/eventsSection"

interface event {
  id: string,
  title: string,
  category: string,
  startDate: number,
  endDate: number,
  location: string,
  description: string,
  eventType: string,
  ticketQuantity: number,
  ticketPrice: number,
  imageURL: string,
  createdAt: Date,
  updatedAt: Date,
  interested: number
}

interface ComponentProps {
  trendingList: event[],
  isLimit: boolean

}

export default function TrendingEvents({ trendingList, isLimit }: ComponentProps) {

  const [eventList, setEventList] = useState<event[]>(trendingList || [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMaxedEvents, setIsMaxedEvents] = useState<boolean>(isLimit)
  const [page, setPage] = useState<number>(6)

  // Update local state when props change
  useEffect(() => {
    setEventList(trendingList || [])
    setIsMaxedEvents(isLimit || false)
  }, [trendingList, isLimit])

  const fetchMoreEvents = async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/trendingWorldEvents?page=${pageNum}`, {
        credentials: "include"
      })

      if (!response.ok) {
        // Don't throw error on 401 - just stop loading
        if (response.status === 401 || response.status === 440) {
          setIsLoading(false)
          setIsMaxedEvents(true)
          return
        }
        const resData = await response.json()
        const error = new Error(resData)
        throw error
      }

      const resData = await response.json()
      setEventList(prev => [...prev, ...(resData.foundEvents || [])])
      setIsMaxedEvents(resData.isLimit || false)
      setIsLoading(false)
    } catch (err: unknown) {
      const error = err as { message: string }
      setIsLoading(false)
      setIsMaxedEvents(true)
    }
  }

  const handleSeeMore = () => {
    const newPage = page + 6
    setPage(newPage)
    fetchMoreEvents(newPage)
  }

  return (
    <div className="flex flex-col justify-start items-start w-full">
      <div className="flex flex-col justify-start gap-5 items-start">
        <p className="text-[40px] font-bold font-monster text-[#2D2C3C]">Trending Events Around the World</p>
      </div>

      <div className="flex flex-col justify-start gap-5 items-start w-full">
        <EventsSection eventList={eventList} />
        <div className="flex w-full justify-center items-center">
          <button disabled={isMaxedEvents || isLoading} onClick={handleSeeMore}
            className="w-1/3 py-3 rounded-md text-[#2B293D] border-2 border-[#2B293D] font-opensans font-semibold text-[24px] hover:bg-[#2B293D] hover:text-white duration-150 ease-in-out disabled:pointer-events-none disabled:text-[#2B293D]/50 disabled:border-[#2B293D]/30 ">
            {isLoading ? 'Loading...' : 'See More'}
          </button>
        </div>
      </div>
    </div>
  )
}