import { Suspense } from "react";
import { EventDetails } from "./event-details";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails id={params.id} />
      </Suspense>
    </main>
  );
}

function EventDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-2/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}