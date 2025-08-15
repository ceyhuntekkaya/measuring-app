'use client';

import * as React from "react";
import { Input, InputProps } from "./input";

export type NumberInputType = 'money' | 'percent' | 'number' | 'distance';

export interface NumberInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
    value?: number;
    onChange?: (value: number) => void;
    inputType?: NumberInputType;
    // Para ayarları
    currency?: string;
    locale?: string;
    // Genel ayarlar
    allowNegative?: boolean;
    maxValue?: number;
    minValue?: number;
    decimalPlaces?: number;
    // Mesafe ayarları
    unit?: string; // 'km', 'm', 'cm' vs.
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({
         value = 0,
         onChange,
         inputType = 'money',
         currency = "TRY",
         locale = "tr-TR",
         allowNegative = false,
         maxValue,
         minValue = 0,
         decimalPlaces,
         unit = 'km',
         ...props
     }, ref) => {
        const [displayValue, setDisplayValue] = React.useState<string>('');
        const [isFocused, setIsFocused] = React.useState(false);

        // Değeri formatla
        const formatValue = (amount: number): string => {
            switch (inputType) {
                case 'money':
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount);

                case 'percent':
                    return new Intl.NumberFormat(locale, {
                        style: 'percent',
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount / 100);

                case 'distance':
                    return new Intl.NumberFormat(locale, {
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount) + ' ' + unit;

                case 'number':
                default:
                    return new Intl.NumberFormat(locale, {
                        minimumFractionDigits: decimalPlaces ?? 2,
                        maximumFractionDigits: decimalPlaces ?? 2
                    }).format(amount);
            }
        };

        // String'i sayıya çevir
        const parseValue = (text: string): number => {
            // Sadece rakamları, virgülü ve noktayı al
            const cleanText = text.replace(/[^\d,.-]/g, '');

            if (!cleanText) return 0;

            // Virgülü noktaya çevir (Türkçe ondalık ayırıcı)
            const normalizedText = cleanText.replace(',', '.');

            const parsed = parseFloat(normalizedText);
            return isNaN(parsed) ? 0 : parsed;
        };

        // Placeholder değeri al
        const getPlaceholder = (): string => {
            if (props.placeholder) return props.placeholder;

            switch (inputType) {
                case 'money':
                    return formatValue(0);
                case 'percent':
                    return '0%';
                case 'distance':
                    return `0 ${unit}`;
                case 'number':
                default:
                    return '0';
            }
        };

        // Value prop'u değiştiğinde displayValue'yu güncelle
        React.useEffect(() => {
            if (!isFocused) {
                setDisplayValue(formatValue(value));
            }
        }, [value, isFocused, locale, currency, inputType, unit, decimalPlaces]);

        // İlk render'da displayValue'yu ayarla
        React.useEffect(() => {
            setDisplayValue(formatValue(value));
        }, []);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            // Focus olduğunda sadece sayısal değeri göster
            setDisplayValue(value.toString());
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);

            const numericValue = parseValue(displayValue);
            let finalValue = numericValue;

            // Negatif değer kontrolü
            if (!allowNegative && finalValue < 0) {
                finalValue = 0;
            }

            // Min/Max değer kontrolü
            if (minValue !== undefined && finalValue < minValue) {
                finalValue = minValue;
            }
            if (maxValue !== undefined && finalValue > maxValue) {
                finalValue = maxValue;
            }

            // Boş değer kontrolü - boş ise 0 yap
            if (isNaN(finalValue) || finalValue === null || finalValue === undefined) {
                finalValue = 0;
            }

            // Formatlanmış şekilde göster
            setDisplayValue(formatValue(finalValue));

            // Değer değiştiyse callback'i çağır
            if (onChange && finalValue !== value) {
                onChange(finalValue);
            }

            props.onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            if (isFocused) {
                // Focus durumunda sadece sayısal girişe izin ver
                if (newValue === '' || /^-?\d*[.,]?\d*$/.test(newValue)) {
                    setDisplayValue(newValue);
                }
            } else {
                setDisplayValue(newValue);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Enter tuşuna basıldığında blur işlemi yap
            if (e.key === 'Enter') {
                e.currentTarget.blur();
            }
            props.onKeyDown?.(e);
        };

        return (
            <Input
                {...props}
                ref={ref}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                inputMode="decimal"
                autoComplete="off"
            />
        );
    }
);

NumberInput.displayName = "NumberInput";

// Geriye uyumluluk için MoneyInput alias'ı
const MoneyInput = React.forwardRef<HTMLInputElement, Omit<NumberInputProps, 'inputType'>>(
    (props, ref) => {
        return <NumberInput {...props} inputType="money" ref={ref} />;
    }
);

MoneyInput.displayName = "MoneyInput";

export { NumberInput, MoneyInput };