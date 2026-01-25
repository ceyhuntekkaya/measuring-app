import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import siteConfig from "@/config/config.json";


const BACKEND_URL = siteConfig.api.invokeUrl;
export const AXIOS_INSTANCE = Axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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
    
    // Check if response has success: false (backend error in successful HTTP response)
    // This handles cases where backend returns 200 OK but success: false
   
    
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      const apiResponse = response.data as { success?: boolean; message?: string; errors?: string[] | string };
     
      
      if (apiResponse.success === false) {
        // Reject the promise so it's handled as an error
        // Error message'i backend'den gelen message olarak ayarla
        const errorMessage = apiResponse.message || 'İşlem başarısız oldu';
       
        
        const error = new Error(errorMessage) as AxiosError<{ success: false; message?: string; errors?: string[] | string }>;
        (error as AxiosError).response = {
          data: {
            success: false,
            message: apiResponse.message,
            errors: apiResponse.errors
          },
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config
        } as AxiosResponse;
        
      
        
        return Promise.reject(error);
      }
    }
    
    return response;
  },
  async (error) => {
   
    
    // Parse Blob response data if it exists (backend returns JSON as Blob even on errors)
    if (error.response?.data instanceof Blob && error.response.data.type === 'application/json') {
      try {
        const text = await error.response.data.text();
        const jsonData = JSON.parse(text);
      
        error.response.data = jsonData;
        
        // Check if parsed data has success: false and message
        if (jsonData && typeof jsonData === 'object' && 'success' in jsonData && jsonData.success === false) {
        
        }
      } catch {
        // Ignore parse errors
      }
    }
    
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
  }).then(async (response: AxiosResponse<T | Blob>) => {
    let data = response.data;
    
    // ORVAL generates API calls with responseType: "blob", but the actual response is JSON
    // Parse Blob responses to JSON automatically
    if (data instanceof Blob && config.responseType === 'blob') {
      try {
        const text = await data.text();
        const jsonData = JSON.parse(text);
        data = jsonData as T;
      } catch (error) {
        // If parsing fails, it might be a real binary blob (like file download)
        // In that case, return as is
        console.warn('Failed to parse blob as JSON, returning as Blob:', error);
        return data as T;
      }
    }
    
    // Check if response has success: false (backend error in successful HTTP response)
    // Response interceptor'da da kontrol var ama burada da kontrol ediyoruz çünkü
    // response interceptor bazen çalışmayabilir veya data farklı parse edilmiş olabilir
   
    
    if (data && typeof data === 'object' && !Array.isArray(data) && 'success' in data) {
      const apiResponse = data as { success?: boolean; message?: string; errors?: string[] | string };
     
      
      if (apiResponse.success === false) {
        // Create an Axios-like error object so it can be caught by onError handlers
        // Error message'i backend'den gelen message olarak ayarla
        const errorMessage = apiResponse.message || 'İşlem başarısız oldu';
       
        
        const error = new Error(errorMessage) as AxiosError<{ success: false; message?: string; errors?: string[] | string }>;
        (error as AxiosError).response = {
          data: {
            success: false,
            message: apiResponse.message,
            errors: apiResponse.errors
          },
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config
        } as AxiosResponse;
        
       
        
        return Promise.reject(error);
      }
    }
    
    return data as T;
  }).catch((error) => {
    // Eğer response interceptor'da hata fırlatıldıysa, onu da yakalayalım
    // Ama zaten error.response.data.message varsa, getErrorMessage onu alacak
    return Promise.reject(error);
  });

  // @ts-expect-error - cancel property is added dynamically
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosResponse<Error>;
export type BodyType<BodyData> = BodyData;