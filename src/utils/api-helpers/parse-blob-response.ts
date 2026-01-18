/**
 * ORVAL generates API calls that return Blob, but the actual response is JSON.
 * This helper function parses the Blob response to the expected type.
 * 
 * @param blobResponse - The Blob response from ORVAL generated API
 * @returns Promise that resolves to the parsed JSON data
 */
export async function parseBlobResponse<T>(blobResponse: Blob): Promise<T> {
  try {
    const text = await blobResponse.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error parsing blob response:', error);
    throw new Error('Failed to parse API response');
  }
}

/**
 * Helper to safely access data from ORVAL API responses that return Blob
 * This function handles both direct data access and blob parsing
 * 
 * @param response - The response from ORVAL generated API (could be Blob or already parsed)
 * @param defaultValue - Default value to return if parsing fails
 * @returns The parsed data or default value
 */
export async function getDataFromBlobResponse<T>(
  response: Blob | T | undefined,
  defaultValue: T
): Promise<T> {
  if (!response) {
    return defaultValue;
  }
  
  // If it's already parsed (not a Blob), return it directly
  if (response instanceof Blob) {
    return await parseBlobResponse<T>(response);
  }
  
  return response as T;
}

/**
 * Synchronous version for cases where we know the response structure
 * Use this when the response is already an object with a 'data' property
 */
export function parseApiResponse<T>(response: Blob | { data?: T } | undefined): T | undefined {
  if (!response) {
    return undefined;
  }
  
  // If it's a Blob, we can't parse it synchronously - return undefined
  // The caller should use the async version
  if (response instanceof Blob) {
    return undefined;
  }
  
  // If it has a data property, return it
  if ('data' in response && response.data !== undefined) {
    return response.data;
  }
  
  // Otherwise, assume the response itself is the data
  return response as T;
}
