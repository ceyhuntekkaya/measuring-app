import React from "react";

export type IconProps = {
    className?: string;
    size?: number | string;
};

export interface Column<T> {
    key: keyof T | 'actions';
    header: string;
    sortable?: boolean;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    actions?: Array<{
        icon?: React.ComponentType<IconProps>;
        label?: string;
        onClick: (item: T) => void;
        className?: string;
    }>;
}



export type RecordType = {
    [key: string]: unknown;
};