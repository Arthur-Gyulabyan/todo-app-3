const BASE_URL = '/api/v1';

/**
 * Generic fetch request helper.
 * @param method HTTP method (GET, POST).
 * @param path API endpoint path.
 * @param data Optional body data for POST requests.
 * @returns A Promise resolving to the parsed JSON response.
 * @throws Error if the network request fails or the response status is not OK.
 */
async function request<T>(method: string, path: string, data?: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Only attach body for non-GET requests if data is provided
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorBody: { message?: string } = { message: `HTTP error! status: ${response.status}` };
    try {
      // Attempt to parse error message from response body if available and not empty
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json") && response.status !== 204) {
        errorBody = await response.json();
      }
    } catch (e) {
      // Ignore parsing error, use default message
    }
    throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
  }

  // Check content type to prevent parsing empty responses as JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json") && response.status !== 204) {
    return response.json() as Promise<T>;
  }

  // If response is OK but no JSON content (e.g., 204 No Content), return an empty object
  // Based on OpenAPI spec, all successful responses return a Todo or array of Todos.
  // This branch should ideally not be hit for successful Todo App API calls.
  return {} as T;
}

export const api = {
  get: <T>(path: string): Promise<T> => request<T>('GET', path),
  post: <T>(path: string, data: unknown): Promise<T> => request<T>('POST', path, data),
  // The OpenAPI spec only uses POST for mutations, no PUT/DELETE explicitly via method type.
  // If the backend used standard REST, we'd add put/delete methods here.
};