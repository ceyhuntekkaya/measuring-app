'use client';

import * as React from "react";

interface ProgressProps {
    value: number;
    className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ value, className = "" }, ref) => {
        const clampedValue = Math.min(100, Math.max(0, value));

        return (
            <div
                ref={ref}
                className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
            >
                <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress };