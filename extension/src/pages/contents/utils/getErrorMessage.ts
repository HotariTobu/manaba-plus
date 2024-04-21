import { t } from "@/utils/i18n"

/**
 * Get a message of a download error code.
 * @param errorCode The download error code
 * @returns A string of error message
 */
export const getErrorMessage = (errorCode: string) => {
  const message = t(`contents_error_message_${errorCode}`)
  if (message.length > 0) {
    return message
  }
  else {
    return errorCode
  }
}
