'use client';

import {createContext, useState, useContext} from 'react';
import {Department, Permission, Role} from '@/types/auth';

const _permissions: Permission[] = [
    'ADD', 'DELETE', 'UPDATE', 'LIST', 'VIEW', 'APPROVE'
];

const _departments: Department[] = [
    'TURKISH',
    'ENGLISH',
    'GERMAN',
    'CHINESE',
    'ARABIC',
    'FRENCH',
    'JAPANESE',
    'RUSSIAN',
    'KOREAN',
    'GREEK',
    'PERSIAN',
];

const _roles: Role[] = [
    'ADMIN', 'USER', 'LEARNER', 'MANAGER', 'REFEREE', 'WRITER', 'OBSERVER'
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
