export interface DropdownItem {
    icon?: React.ReactNode;
    label: string;
    href?: string;
    type?: string;
    onClick?: () => void;
    variant?: 'default' | 'danger' | 'warning';
}

export interface DropdownButtonProps {
    label: string;
    icon?: React.ReactNode;
    items: DropdownItem[];
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}