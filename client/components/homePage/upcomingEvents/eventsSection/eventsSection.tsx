import EventCard from "../../eventCard/eventCard"

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
  eventList: event[]
}

export default function EventsSection({ eventList }: ComponentProps) {

  if (!eventList || eventList.length === 0) {
    return (
      <div className="flex w-full justify-center items-center min-h-[200px]">
        <p className="text-[24px] text-[#2D2C3C] font-semibold">No events found. Check back later!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-y-5 w-full">
      {eventList.map((event: event) => <EventCard key={event.id} event={event} />)}
    </div>
  )
}