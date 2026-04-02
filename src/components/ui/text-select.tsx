'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectValue as SelectPrimitiveValue,
  type SelectValues,
} from '@/components/ui/select';
import HtmlRender from '@/components/ui/html-render';

export type TextSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export interface TextSelectProps {
  id?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;

  /** HTML string rendered above the select. */
  html: string;
  placeholder?: string;
  options: TextSelectOption[];

  onChange?: (value: string) => void;
}

export default function TextSelect({
  id,
  value,
  defaultValue,
  disabled = false,
  className = '',
  html,
  placeholder = 'Seçin',
  options,
  onChange,
}: TextSelectProps) {
  const reactId = React.useId();
  const selectId = id ?? `text-select-${reactId}`;

  const isControlled = typeof value === 'string';
  const [uncontrolled, setUncontrolled] = React.useState<string>(defaultValue ?? '');
  const currentValue = isControlled ? (value as string) : uncontrolled;

  const handleValueChange = (next: SelectPrimitiveValue | SelectValues) => {
    if (disabled) return;
    const raw = Array.isArray(next) ? next[0] : next;
    const str = raw === undefined || raw === null ? '' : String(raw);
    if (!isControlled) setUncontrolled(str);
    onChange?.(str);
  };

  return (
    <div
      className={[
        'w-full rounded-lg border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4',
        disabled ? 'opacity-60' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-disabled={disabled}
    >
      <HtmlRender
        className="text-sm leading-relaxed text-gray-800 [&_b]:font-semibold [&_strong]:font-semibold [&_a]:underline"
        html={html}
      />

      <div className="mt-4">
        <Select value={currentValue} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger id={selectId}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

