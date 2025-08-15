import {useState, useCallback, useEffect} from 'react';
import {User, UserFormData} from '@/types/auth';
import {userService} from "@/services/api/user-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";

export const useUsers = (): {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: Error | null;
    fetchUsers: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    createUser: (user: UserFormData) => Promise<void>;
    updateUser: (user: UserFormData) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    resetUserPassword: (id: string, password: string) => Promise<void>;
} => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getUserById(id);
            setSelectedUser(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const createUser = useCallback(async (user: UserFormData) => {
        try {
            setLoading(true);
            setError(null);
            await userService.createUser(user);
            await fetchUsers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/users`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers, router]);

    const updateUser = useCallback(async (user: UserFormData) => {
        try {
            setLoading(true);
            setError(null);
            await userService.updateUser(user.id, user);
            await fetchUsers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/users`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers, router]);

    const deleteUser = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await userService.deleteUser(id);
            await fetchUsers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/users`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers, router]);



    const resetUserPassword = useCallback(async (id: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.resetUserPassword(id, password);
            setSelectedUser(data);
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/users`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);



    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        selectedUser,
        loading,
        error,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        resetUserPassword,
    };
};