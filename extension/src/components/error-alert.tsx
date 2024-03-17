import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { RootContainer } from "./root-container"

export const ErrorAlert = (props: {
  error: Error
}) => {
  const error = props.error instanceof Error ? props.error : new Error(props.error)
  return (
    <RootContainer>
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </RootContainer>
  )
}
