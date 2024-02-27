import { ErrorInfo, PropsWithChildren, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast, Toaster } from "sonner"

const ErrorToaster = (props: {
  error: Error
}) => {
  useEffect(() => {
    toast.error(props.error.message)
  }, [props.error.message])

  return (
    <Toaster richColors position="bottom-left" />
  )
}

export const ErrorReporter = (props: PropsWithChildren<{
  onError: (error: Error, info: ErrorInfo) => void
}>) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorToaster} onError={props.onError}>
      {props.children}
    </ErrorBoundary>
  )
}
