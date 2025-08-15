'use client';

import React from 'react';

interface SwitchProps {
    id?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ id, checked, onCheckedChange, disabled = false, className = '' }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                id={id}
                ref={ref}
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onCheckedChange(!checked)}
                className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer 
          rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-200'} 
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${className}
        `}
            >
        <span
            aria-hidden="true"
            className={`
            pointer-events-none inline-block h-5 w-5 transform 
            rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
                <span className="sr-only">
          {checked ? 'Açık' : 'Kapalı'}
        </span>
            </button>
        );
    }
);

Switch.displayName = 'Switch';

export { Switch };