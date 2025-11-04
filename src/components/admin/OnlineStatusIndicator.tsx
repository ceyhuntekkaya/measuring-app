'use client';

interface OnlineStatusIndicatorProps {
    isOnline: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function OnlineStatusIndicator({
                                                  isOnline,
                                                  size = 'md'
                                              }: OnlineStatusIndicatorProps) {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
            {isOnline && (
                <div
                    className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-green-500 animate-ping opacity-75`}
                />
            )}
        </div>
    );
}