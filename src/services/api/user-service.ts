import api from './base-api';
import {User, UserFormData} from "@/types/auth";



class UserService {

    private readonly baseUrl = '/user';

    async createUser(user: UserFormData): Promise<User> {
        const response = await api.post<User>(`${this.baseUrl}/`, user);
        return response.data;
    }

    async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getUserById(userId: string): Promise<User> {
        const response = await api.get<User>(`${this.baseUrl}/${userId}`);
        return response.data;
    }

    async getUserBySearchByName(text: string): Promise<User[]> {
        const response = await api.get<User[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateUser(userId: string, user: UserFormData): Promise<User> {
        const response = await api.put<User>(`${this.baseUrl}/${userId}`, user);
        return response.data;
    }

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${userId}`);
    }

    async resetUserPassword(userId: string, password: string): Promise<User> {
        const response =await api.post(`${this.baseUrl}/${userId}`, {userId: userId, password: password});
        return response.data;
    }


}

export const userService = new UserService();