'use client';

import {createContext, useState, useContext} from 'react';
import {Department, Permission, Role} from '@/types/auth';
import type {UserDto} from '@/api/generated/model';
import {useGetAllUsers} from "@/api/generated/user-management/user-management";


const _permissions: Permission[] = [
    'APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION',
    'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION',
    'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION',
    'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'
];

const _departments: Department[] = [
    'GRADER', 'SUPERVISOR', 'MANAGEMENT', 'IT', 'AUTHOR_REVIEWER', 'ADMIN', 'REVIEWER'
];

const _roles: Role[] = [
    'ADMIN', 'USER', 'LEARNER', 'COMPANY', 'INSTRUCTOR', 'OBSERVER'
];

export interface DataContextType {
    users: UserDto[] | null;
    loading: boolean;
    error: string | null;
    permissions: Permission[];
    departments: Department[];
    roles: Role[];
}


export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({children}: { children: React.ReactNode }) {

    const [permissions, ] = useState(_permissions);
    const [departments, ] = useState(_departments);
    const [roles, ] = useState(_roles);

    const {data, isLoading: loading} = useGetAllUsers({});
    const users = (data as unknown as { data?: UserDto[] })?.data || null;
    const [error] = useState<string | null>(null);





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