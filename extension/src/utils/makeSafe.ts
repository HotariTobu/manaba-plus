type OkResult<T> = {
  success: true
  data: T
}

type BadResult = {
  success: false
  message: string
}

type SafeResult<T> = OkResult<T> | BadResult

/**
 * Get an error message from a thrown error object.
 * @param error The thrown error object
 * @returns The string expression of the error object
 */
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object') {
    if (error === null) {
      return ''
    }
    else {
      return JSON.stringify(error)
    }
  }

  if (typeof error === 'undefined') {
    return ''
  }

  return String(error)
}

/**
 * Wrap a function implement with a try/catch block and make it safe.
 * @param func The function object
 * @returns A safe function
 */
export const makeSafe = <P extends unknown[], R>(func: (...args: P) => R): (...args: P) => SafeResult<R> => {
  return (...args) => {
    try {
      return {
        success: true,
        data: func(...args),
      }
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }
}

/**
 * Wrap an async function implement with a try/catch block and make it safe.
 * @param func The async function object
 * @returns A safe async function
 */
export const makeSafeAsync = <P extends unknown[], R>(func: (...args: P) => Promise<R>): (...args: P) => Promise<SafeResult<R>> => {
  return async (...args) => {
    try {
      return {
        success: true,
        data: await func(...args),
      }
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }
}
