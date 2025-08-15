'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { DropdownButtonProps, DropdownItem } from '@/types/dropdown';

const DropdownButton: React.FC<DropdownButtonProps> = ({
                                                           label,
                                                           icon,
                                                           items,
                                                           size = 'md',
                                                           variant = 'primary'
                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dropdown dışına tıklandığında kapanma
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Variant styles
    const buttonVariants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    // Item variant styles
    const itemVariants = {
        default: 'text-gray-700 hover:bg-gray-100',
        danger: 'text-red-600 hover:bg-red-50',
        warning: 'text-yellow-600 hover:bg-yellow-50',
    };

    const renderDropdownItem = (item: DropdownItem, index: number) => {
        const itemStyle = `flex items-center px-4 py-2 text-sm ${
            itemVariants[item.variant || 'default']
        }`;

        if (item.href) {
            return (
                <Link href={item.href} className={itemStyle} key={index}>
                    {item.icon && <span className="w-4 h-4 mr-2">{item.icon}</span>}
                    {item.label}
                </Link>
            );
        }

        return (
            <button
                onClick={item.onClick}
                className={`w-full text-left ${itemStyle}`}
                key={index}
            >
                {item.icon && <span className="w-4 h-4 mr-2">{item.icon}</span>}
                {item.label}
            </button>
        );
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          inline-flex items-center justify-center rounded-lg transition-colors duration-200
          ${buttonVariants[variant]}
          ${sizeStyles[size]}
        `}
            >
                {icon && <span className="w-4 h-4 mr-2">{icon}</span>}
                {label}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        {items.map((item, index) => renderDropdownItem(item, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;