import { ErrorAlert } from "@/components/error-alert";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

export const PageContainer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <ErrorBoundary FallbackComponent={ErrorAlert}>
    <div className={cn('w-screen h-screen', className)} {...props} />
    <Toaster richColors />
  </ErrorBoundary>
)
