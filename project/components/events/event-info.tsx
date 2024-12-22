import { Calendar, Clock, Tag } from "lucide-react";
import { Event } from "@/lib/api/ticketmaster";
import { formatDate } from "@/lib/utils";

export function EventInfo({ event }: { event: Event }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{formatDate(event.dates.start.dateTime)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>{event.dates.start.localTime}</span>
        </div>
        {event.classifications?.[0]?.genre && (
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{event.classifications[0].genre.name}</span>
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mb-4">About This Event</h2>
        <p className="text-muted-foreground">
          {event.info || "No additional information available for this event."}
        </p>
      </div>

      {event.pleaseNote && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Please Note</h3>
          <p className="text-sm text-muted-foreground">{event.pleaseNote}</p>
        </div>
      )}
    </div>
  );
}