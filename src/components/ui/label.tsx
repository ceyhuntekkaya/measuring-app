'use client';


import * as React from "react";

export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    error?: boolean;
}



const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <label
                className={`
          block text-xs font-bold text-gray-700 mb-1
          ${error ? "text-red-500" : "text-gray-900"}
          ${className}
        `}
                ref={ref}
                {...props}
            />
        );
    }
);

Label.displayName = "Label";

export { Label };