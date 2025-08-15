'use client';

import * as React from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <input
                className={`
          w-full px-3 py-2 text-xs font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };

