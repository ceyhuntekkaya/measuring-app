import React, { forwardRef } from 'react';

export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'error';
    className?: string;
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    'aria-label'?: string;
    'aria-describedby'?: string;
    name?: string;
    value?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({
         id,
         checked,
         defaultChecked,
         disabled = false,
         indeterminate = false,
         label,
         description,
         size = 'md',
         variant = 'default',
         className = '',
         onChange,
         onFocus,
         onBlur,
         'aria-label': ariaLabel,
         'aria-describedby': ariaDescribedby,
         name,
         value,
         ...props
     }, ref) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event.target.checked, event);
            }
        };

        // Size styles
        const sizeStyles = {
            sm: {
                checkbox: 'h-4 w-4',
                label: 'text-sm',
                description: 'text-xs'
            },
            md: {
                checkbox: 'h-5 w-5',
                label: 'text-base',
                description: 'text-sm'
            },
            lg: {
                checkbox: 'h-6 w-6',
                label: 'text-lg',
                description: 'text-base'
            }
        };

        // Variant styles
        const variantStyles = {
            default: {
                checkbox: 'border-gray-300 text-blue-600 focus:ring-blue-500',
                label: 'text-gray-900',
                description: 'text-gray-500'
            },
            success: {
                checkbox: 'border-green-300 text-green-600 focus:ring-green-500',
                label: 'text-gray-900',
                description: 'text-gray-500'
            },
            warning: {
                checkbox: 'border-yellow-300 text-yellow-600 focus:ring-yellow-500',
                label: 'text-gray-900',
                description: 'text-gray-500'
            },
            error: {
                checkbox: 'border-red-300 text-red-600 focus:ring-red-500',
                label: 'text-gray-900',
                description: 'text-gray-500'
            }
        };

        // Disabled styles
        const disabledStyles = disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer';

        const checkboxClasses = `
      ${sizeStyles[size].checkbox}
      ${variantStyles[variant].checkbox}
      ${disabledStyles}
      rounded border-2 bg-white focus:ring-2 focus:ring-offset-2 transition-colors duration-200
      ${className}
    `.trim();

        const labelClasses = `
      ${sizeStyles[size].label}
      ${variantStyles[variant].label}
      ${disabledStyles}
      font-medium
    `.trim();

        const descriptionClasses = `
      ${sizeStyles[size].description}
      ${variantStyles[variant].description}
      ${disabledStyles}
      mt-1
    `.trim();

        // Generate unique ID if not provided
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        React.useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.indeterminate = indeterminate;
            }
        }, [indeterminate, ref]);

        return (
            <div className="flex items-start">
                <div className="flex items-center">
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        defaultChecked={defaultChecked}
                        disabled={disabled}
                        name={name}
                        value={value}
                        className={checkboxClasses}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        aria-label={ariaLabel}
                        aria-describedby={ariaDescribedby}
                        {...props}
                    />
                </div>

                {(label || description) && (
                    <div className="ml-3">
                        {label && (
                            <label
                                htmlFor={checkboxId}
                                className={labelClasses}
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p className={descriptionClasses}>
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;



/*
// Basit kullanım
<Checkbox label="Kabul ediyorum" />

// Kontrollü kullanım
<Checkbox
  checked={isChecked}
  onChange={(checked) => setIsChecked(checked)}
  label="Haber bültenine abone ol"
/>

// Açıklamalı
<Checkbox
  label="Pazarlama e-postaları"
  description="Ürün güncellemeleri ve özel teklifler hakkında bilgi al"
  size="lg"
  variant="success"
/>

// Indeterminate durumu
<Checkbox
  indeterminate={true}
  label="Tüm öğeleri seç"
/>
 */