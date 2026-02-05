import { type IExecuteFunctions, NodeApiError } from 'n8n-workflow';

export interface EwelinkApiResponse<T = unknown> {
  error: number;
  msg: string;
  data: T;
}

/**
 * Handle eWeLink API response and throw appropriate errors
 */
export function handleApiResponse<T>(
  context: IExecuteFunctions,
  response: EwelinkApiResponse<T>,
  itemIndex: number = 0,
): T {
  if (response.error !== 0) {
    throw new NodeApiError(
      context.getNode(),
      {
        message: response.msg || `eWeLink API error: ${response.error}`,
        description: `Error code: ${response.error}`,
        httpCode: String(response.error),
      },
      { itemIndex },
    );
  }

  return response.data;
}

/**
 * Error code descriptions for eWeLink API
 */
export const ERROR_CODES: Record<number, string> = {
  0: 'Success',
  400: 'Bad request - parameter error',
  401: 'Unauthorized - access token invalid or expired',
  402: 'Access token expired',
  403: 'Forbidden - no permission',
  404: 'Resource not found',
  406: 'Denied due to rate limiting',
  500: 'Internal server error',
  10001: 'App ID invalid',
  10002: 'App not authorized',
  10003: 'Account already exists',
  10004: 'Account not found',
  10005: 'Password incorrect',
  10006: 'Verification code error',
  10007: 'Verification code expired',
  10010: 'Device offline',
  10011: 'Device not found',
  10012: 'Family not found',
  10013: 'Room not found',
  10014: 'No permission for this operation',
};

/**
 * Get human-readable error message for error code
 */
export function getErrorMessage(errorCode: number): string {
  return ERROR_CODES[errorCode] || `Unknown error: ${errorCode}`;
}
