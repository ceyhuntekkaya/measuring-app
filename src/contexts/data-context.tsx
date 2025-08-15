'use client';

import {createContext, useState, useEffect, useContext} from 'react';
import {Department, Permission, Role} from '@/types/auth';
import {DataContextType} from "@/types/base-data";
import {useUsers} from "@/hooks/use-user";


const _permissions: Permission[] = [
    'APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION',
    'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION',
    'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION',
    'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'
];

const _departments: Department[] = [
    'ACCOUNTING', 'FINANCE', 'MANAGEMENT', 'SALES', 'EXTERNAL'
];

const _roles: Role[] = [
    'ADMIN', 'USER', 'LEARNER', 'COMPANY', 'INSTRUCTOR', 'OBSERVER'
];


export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({children}: { children: React.ReactNode }) {

    const [permissions, ] = useState(_permissions);
    const [departments, ] = useState(_departments);
    const [roles, ] = useState(_roles);



    const {users, fetchUsers} = useUsers();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true)
            try {


                await Promise.all([
                    fetchUsers(),
                ]);
            } catch (err) {
                setError("Veriler yüklenirken bir hata oluştu");
                console.error("Veri yükleme hatası:", err);
            }
            setLoading(false)
        };

        fetchAllData();
    }, []);





    const value: DataContextType = {
        users,
        loading,
        error,
        permissions,
        departments,
        roles,
    };

    return (
        <DataContext.Provider value={value}>
            {loading ? (
                <div className="flex h-screen w-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </DataContext.Provider>
    );
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within an DataProvider');
    }
    return context;
}