import axios from 'axios';
import { User, AuthResponse } from '@/types/auth';
import siteConfig from '@/config/config.json';
const API_URL =  siteConfig.api.invokeUrl;

class AuthService {
    async login(username: string, password: string): Promise<AuthResponse> {
        try {
            
            
            

            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
            };

            const response = await axios.post(
                `${API_URL}/auth/login`,
                { username, password },
                config
            );
            const data = response.data;


            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict`;


                // RefreshToken varsa onu da kaydet
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            }

            return data;
        } catch (error) {
            console.error('Login request failed:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            const token = this.getToken();
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                await axios.post(`${API_URL}/auth/logout`, {}, config);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            const token = this.getToken();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/auth/me`, config);
            return response.data;
        } catch (error) {
            console.error('Get current user failed:', error);
            throw error;
        }
    }



    async refreshToken(): Promise<string | null> {
        try {
            const token = localStorage.getItem('refreshToken');
            if (!token) return null;

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const response = await axios.post(
                `${API_URL}/auth/refresh-token`,
                { refreshToken: token },
                config
            );

            return response.data;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await axios.post(
                `${API_URL}/auth/validate-token`,
                {},
                config
            );
            return response.status === 200;
        } catch {
            return false;
        }
    }
}

export const authService = new AuthService();