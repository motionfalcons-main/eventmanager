import { cookies } from "next/headers"
import GreetSection from "@/components/homePage/greetSection/greetSection"
import ExploreCategories from "@/components/homePage/exploreCategories/exploreCategories"
import PopularEvents from "@/components/homePage/upcomingEvents/popularEvents"
import OnlineEvents from "@/components/homePage/onlineEvents/onlineEvents"
import TrendingEvents from "@/components/homePage/trendingEvents/trendingEvents"
import { redirect } from "next/navigation"
export default async function Page() {
  const cookie = cookies()

  try {
    const trendingAroundTheWorld = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/trendingWorldEvents?page=6`, {
      headers: { Cookie: (await cookie).toString() },
      credentials: 'include'
    })

    if (!trendingAroundTheWorld.ok) {
      // If unauthorized, redirect to login
      if (trendingAroundTheWorld.status === 401 || trendingAroundTheWorld.status === 440) {
        redirect('/')
      }
      // For other errors (like 404 - no events), show empty state instead of redirecting
      return (
        <div className="flex flex-col items-start justify-start">
          <GreetSection countryList={[]} />
          <div className="flex flex-col justify-start items-start px-32 w-full">
            <ExploreCategories />
            <div className="flex flex-col justify-start items-start gap-32 w-full">
              <TrendingEvents trendingList={[]} isLimit={true} />
              <PopularEvents />
              <OnlineEvents />
            </div>
          </div>
        </div>
      )
    }

    const trendingList = await trendingAroundTheWorld.json()

    // Handle empty or invalid data gracefully
    const foundEvents = trendingList?.foundEvents || []
    const countryList = trendingList?.countryList || []
    const isLimit = trendingList?.isLimit || false

    return (
      <div className="flex flex-col items-start justify-start">
        <GreetSection countryList={countryList} />
        <div className="flex flex-col justify-start items-start px-32 w-full">
          <ExploreCategories />
          <div className="flex flex-col justify-start items-start gap-32 w-full">
            <TrendingEvents trendingList={foundEvents} isLimit={isLimit} />
            <PopularEvents />
            <OnlineEvents />
          </div>
        </div>
      </div>
    )

  } catch (err: unknown) {
    console.error('Error loading home page:', err)
    // Show empty state instead of redirecting to prevent infinite loop
    return (
      <div className="flex flex-col items-start justify-start">
        <GreetSection countryList={[]} />
        <div className="flex flex-col justify-start items-start px-32 w-full">
          <ExploreCategories />
          <div className="flex flex-col justify-start items-start gap-32 w-full">
            <TrendingEvents trendingList={[]} isLimit={true} />
            <PopularEvents />
            <OnlineEvents />
          </div>
        </div>
      </div>
    )
  }
}