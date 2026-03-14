/**
 * API response'larından data'yı güvenli bir şekilde extract eden helper fonksiyonlar
 * Type safety sağlar ve `as unknown as` kullanımını azaltır
 */

/**
 * Standart API response formatından data'yı extract eder
 * @param response API'den gelen response
 * @returns Data veya null
 */
export function extractApiData<T>(response: unknown): T | null {
  if (!response) return null;
  
  const apiResponse = response as { data?: T };
  return apiResponse?.data ?? null;
}

/**
 * List response'ları için data'yı extract eder
 * @param response API'den gelen list response
 * @returns Data array veya boş array
 */
export function extractApiListData<T>(response: unknown): T[] {
  const data = extractApiData<T[]>(response);
  return Array.isArray(data) ? data : [];
}

/**
 * Nested data yapısından data'yı extract eder
 * Örnek: { data: { examSessions: [...] } }
 */
export function extractNestedApiData<T>(
  response: unknown,
  nestedKey: string
): T | null {
  if (!response) return null;
  
  const apiResponse = response as { data?: Record<string, unknown> };
  const nestedData = apiResponse?.data?.[nestedKey];
  
  return (nestedData as T) ?? null;
}

/**
 * Nested list data yapısından array'i extract eder
 * Örnek: { data: { examSessions: [...] } }
 */
export function extractNestedApiListData<T>(
  response: unknown,
  nestedKey: string
): T[] {
  const nestedData = extractNestedApiData<T[]>(response, nestedKey);
  return Array.isArray(nestedData) ? nestedData : [];
}
