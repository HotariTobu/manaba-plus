import { Skeleton } from "@/components/ui/skeleton";

export const AssignmentsLoading = () => (
  <div className="gap-2 flex flex-col">
    <Skeleton className="h-4" />
    <Skeleton className="h-4" />
    <Skeleton className="h-4 me-16" />
  </div>
)
