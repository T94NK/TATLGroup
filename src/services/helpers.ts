import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

// resource: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#inline-error-handling-example

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error).message === 'string'
  )
}