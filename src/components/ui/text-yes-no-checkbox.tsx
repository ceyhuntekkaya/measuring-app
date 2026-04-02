'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import HtmlRender from '@/components/ui/html-render';

export interface TextYesNoCheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;

  /** HTML string rendered above the buttons. */
  html: string;

  yesLabel?: string;
  noLabel?: string;

  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextYesNoCheckbox({
  id,
  checked,
  defaultChecked,
  disabled = false,
  className = '',
  html,
  yesLabel = 'Evet',
  noLabel = 'Hayır',
  onChange,
}: TextYesNoCheckboxProps) {
  const reactId = React.useId();
  const inputId = id ?? `text-yes-no-${reactId}`;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const isControlled = typeof checked === 'boolean';
  const [uncontrolled, setUncontrolled] = React.useState<boolean>(defaultChecked ?? false);
  const value = isControlled ? (checked as boolean) : uncontrolled;

  const emitChange = React.useCallback(
    (next: boolean) => {
      if (!inputRef.current) return;

      // Keep the hidden input in sync for accessibility and form integration.
      inputRef.current.checked = next;

      const evt = new Event('change', { bubbles: true });
      onChange?.(next, evt as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [onChange]
  );

  const setValue = (next: boolean) => {
    if (disabled) return;
    if (!isControlled) setUncontrolled(next);
    emitChange(next);
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
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        className="sr-only"
        checked={isControlled ? value : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        onChange={(e) => {
          const next = e.target.checked;
          if (!isControlled) setUncontrolled(next);
          onChange?.(next, e);
        }}
      />

      <HtmlRender
        className="text-sm leading-relaxed text-gray-800 [&_b]:font-semibold [&_strong]:font-semibold [&_a]:underline"
        html={html}
      />

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={value ? 'primary' : 'outline'}
          onClick={() => setValue(true)}
          disabled={disabled}
          aria-pressed={value}
        >
          {yesLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={!value ? 'destructive' : 'outline'}
          onClick={() => setValue(false)}
          disabled={disabled}
          aria-pressed={!value}
        >
          {noLabel}
        </Button>
      </div>
    </div>
  );
}

