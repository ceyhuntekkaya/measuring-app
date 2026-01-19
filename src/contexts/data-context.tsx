'use client';

import {createContext, useState, useContext} from 'react';
import {Department, Permission, Role} from '@/types/auth';

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
    permissions: Permission[];
    departments: Department[];
    roles: Role[];
}


export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({children}: { children: React.ReactNode }) {

    const [permissions, ] = useState(_permissions);
    const [departments, ] = useState(_departments);
    const [roles, ] = useState(_roles);

    const value: DataContextType = {
        permissions,
        departments,
        roles,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
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
