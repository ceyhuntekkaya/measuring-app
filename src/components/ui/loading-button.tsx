import LoadingSpinner from './loading-spinner';
import React from "react";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export default function LoadingButton({
                                          isLoading = false,
                                          loadingText = 'Loading...',
                                          children,
                                          disabled,
                                          className = '',
                                          ...props
                                      }: LoadingButtonProps) {
    return (
        <button
            disabled={isLoading || disabled}
            className={`relative inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {isLoading && (
                <span className="absolute left-4">
          <LoadingSpinner size="sm" color="white"/>
        </span>
            )}
            <span className={isLoading ? 'pl-6' : ''}>
        {isLoading ? loadingText : children}
      </span>
        </button>
    );
}