import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import siteConfig from "@/config/config.json";


const BACKEND_URL = siteConfig.api.invokeUrl;
export const AXIOS_INSTANCE = Axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token interceptor
AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Don't send token for login endpoints
    const isLoginEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/exam-taking/login');
    
    if (!isLoginEndpoint) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Response interceptor for error handling and Blob parsing
AXIOS_INSTANCE.interceptors.response.use(
  async (response) => {
    // ORVAL generates API calls with responseType: "blob", but the actual response is JSON
    // Parse Blob responses to JSON automatically
    if (response.data instanceof Blob && response.config.responseType === 'blob') {
      try {
        const text = await response.data.text();
        const jsonData = JSON.parse(text);
        response.data = jsonData;
      } catch (error) {
        // If parsing fails, it might be a real binary blob (like file download)
        // In that case, keep it as Blob
        console.warn('Failed to parse blob as JSON, keeping as Blob:', error);
      }
    }
    return response;
  },
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(async ({ data }: AxiosResponse<T | Blob>) => {
    // ORVAL generates API calls with responseType: "blob", but the actual response is JSON
    // Parse Blob responses to JSON automatically
    if (data instanceof Blob && config.responseType === 'blob') {
      try {
        const text = await data.text();
        const jsonData = JSON.parse(text);
        return jsonData as T;
      } catch (error) {
        // If parsing fails, it might be a real binary blob (like file download)
        // In that case, return as is
        console.warn('Failed to parse blob as JSON, returning as Blob:', error);
        return data as T;
      }
    }
    return data as T;
  });

  // @ts-expect-error - cancel property is added dynamically
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosResponse<Error>;
export type BodyType<BodyData> = BodyData;