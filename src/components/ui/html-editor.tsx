'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Code2, Eraser, Italic, List, ListOrdered, Underline } from 'lucide-react';

export interface HtmlEditorProps {
  id?: string;
  value: string;
  onChange: (nextHtml: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  minHeightClassName?: string; // e.g. "min-h-[100px]"
  error?: boolean;
}

type Command =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'removeFormat'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'foreColor';

function exec(command: Command) {
  // execCommand is deprecated but still supported broadly and is fine for a lightweight editor.
  document.execCommand(command);
}

function execWithValue(command: Command, value: string) {
  document.execCommand(command, false, value);
}

type HeadingValue = 'p' | 'h1' | 'h2' | 'h3';
function execHeading(tag: HeadingValue) {
  const value = tag === 'p' ? 'P' : tag.toUpperCase();
  document.execCommand('formatBlock', false, value);
}

type AlignValue = 'left' | 'center' | 'right';
function execAlign(value: AlignValue) {
  if (value === 'left') exec('justifyLeft');
  if (value === 'center') exec('justifyCenter');
  if (value === 'right') exec('justifyRight');
}

type ColorValue = 'inherit' | 'black' | 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
const COLORS: Array<{ value: ColorValue; label: string; hex?: string }> = [
  { value: 'inherit', label: 'Renk' },
  { value: 'black', label: 'Siyah', hex: '#111827' },
  { value: 'gray', label: 'Gri', hex: '#6B7280' },
  { value: 'red', label: 'Kırmızı', hex: '#DC2626' },
  { value: 'orange', label: 'Turuncu', hex: '#F97316' },
  { value: 'yellow', label: 'Sarı', hex: '#EAB308' },
  { value: 'green', label: 'Yeşil', hex: '#16A34A' },
  { value: 'blue', label: 'Mavi', hex: '#2563EB' },
  { value: 'purple', label: 'Mor', hex: '#7C3AED' },
];

function normalizeHtml(html: string) {
  return (html ?? '').trim();
}

function isSelectionInside(el: HTMLElement, selection: Selection | null) {
  if (!selection || selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const node = container.nodeType === Node.ELEMENT_NODE ? (container as Element) : container.parentElement;
  return !!node && el.contains(node);
}

export function HtmlEditor({
  id,
  value,
  onChange,
  disabled = false,
  placeholder,
  className = '',
  minHeightClassName = 'min-h-[160px]',
  error = false,
}: HtmlEditorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const lastValueRef = React.useRef<string>(normalizeHtml(value));
  const didInitRef = React.useRef(false);
  const [showHtml, setShowHtml] = React.useState(false);
  const prevShowHtmlRef = React.useRef(showHtml);
  const selectionRef = React.useRef<Range | null>(null);

  const setEditorHtml = React.useCallback((html: string) => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html || '';
  }, []);

  const restoreSelection = React.useCallback(() => {
    const el = ref.current;
    const range = selectionRef.current;
    if (!el || !range) return;
    el.focus();
    const sel = document.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  React.useLayoutEffect(() => {
    if (didInitRef.current) return;
    if (showHtml) return;
    didInitRef.current = true;
    const next = normalizeHtml(value);
    setEditorHtml(next);
    lastValueRef.current = next;
  }, [setEditorHtml, showHtml, value]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const next = normalizeHtml(value);
    const last = lastValueRef.current;
    if (next === last) return;

    // Avoid fighting the user's caret while typing.
    const active = document.activeElement === el;
    if (!active && !showHtml) {
      setEditorHtml(next);
      lastValueRef.current = next;
    }
  }, [setEditorHtml, showHtml, value]);

  React.useEffect(() => {
    // When switching HTML -> WYSIWYG, the editable div is not rendered with innerHTML by React.
    // Sync it immediately so content is visible without requiring focus.
    const prev = prevShowHtmlRef.current;
    prevShowHtmlRef.current = showHtml;
    if (!(prev === true && showHtml === false)) return;

    const next = normalizeHtml(value);
    // Ensure the contentEditable div is mounted, then sync once.
    requestAnimationFrame(() => {
      setEditorHtml(next);
      lastValueRef.current = next;
    });
  }, [setEditorHtml, showHtml, value]);

  React.useEffect(() => {
    if (showHtml) return;
    const el = ref.current;
    if (!el) return;

    const onSelectionChange = () => {
      const sel = document.getSelection();
      if (!isSelectionInside(el, sel)) return;
      if (!sel || sel.rangeCount === 0) return;
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [showHtml]);

  const emit = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const html = normalizeHtml(el.innerHTML);
    lastValueRef.current = html;
    onChange(html);
  }, [onChange]);

  const applyColor = (color: ColorValue) => {
    if (disabled || showHtml) return;
    restoreSelection();
    const next = COLORS.find((c) => c.value === color)?.hex;
    if (!next) return;
    execWithValue('foreColor', next);
    emit();
  };

  const isEmpty = normalizeHtml(value).length === 0;

  return (
    <div
      className={[
        'w-full rounded-md border bg-white',
        error ? 'border-red-500' : 'border-gray-300',
        disabled ? 'opacity-60' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-disabled={disabled}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-2">
        <select
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm"
          disabled={disabled || showHtml}
          defaultValue="p"
          onChange={(e) => {
            restoreSelection();
            execHeading(e.target.value as HeadingValue);
            emit();
          }}
          aria-label="Başlık seviyesi"
          title="Başlık"
        >
          <option value="p">Normal</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <select
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm"
          disabled={disabled || showHtml}
          defaultValue="left"
          onChange={(e) => {
            restoreSelection();
            execAlign(e.target.value as AlignValue);
            emit();
          }}
          aria-label="Hizalama"
          title="Hizalama"
        >
          <option value="left">Sola</option>
          <option value="center">Ortala</option>
          <option value="right">Sağa</option>
        </select>
        <select
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm"
          disabled={disabled || showHtml}
          defaultValue="inherit"
          onChange={(e) => applyColor(e.target.value as ColorValue)}
          aria-label="Yazı rengi"
          title="Yazı rengi"
        >
          {COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('bold');
            emit();
          }}
          aria-label="Kalın"
          title="Kalın"
        >
          <Bold className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('italic');
            emit();
          }}
          aria-label="İtalik"
          title="İtalik"
        >
          <Italic className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('underline');
            emit();
          }}
          aria-label="Altı çizili"
          title="Altı çizili"
        >
          <Underline className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('insertUnorderedList');
            emit();
          }}
          aria-label="Liste"
          title="Liste"
        >
          <List className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('insertOrderedList');
            emit();
          }}
          aria-label="Numaralı liste"
          title="Numaralı liste"
        >
          <ListOrdered className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || showHtml}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            restoreSelection();
            exec('removeFormat');
            emit();
          }}
          aria-label="Biçimlendirmeyi temizle"
          title="Biçimlendirmeyi temizle"
        >
          <Eraser className="h-4 w-4 text-gray-700" aria-hidden />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant={showHtml ? 'primary' : 'outline'}
            disabled={disabled}
            onClick={() => {
              setShowHtml((v) => !v);
            }}
            title="HTML kodunu göster/gizle"
            aria-label="HTML kodunu göster/gizle"
          >
            <Code2 className={['h-4 w-4', showHtml ? 'text-white' : 'text-gray-700'].join(' ')} aria-hidden />
          </Button>
        </div>
      </div>

      <div className="relative">
        {placeholder && isEmpty && (
          <div className="pointer-events-none absolute left-3 top-3 select-none text-sm text-gray-400">
            {placeholder}
          </div>
        )}
        {showHtml ? (
          <textarea
            id={id}
            className={[
              'w-full resize-y bg-transparent px-3 py-2 font-mono text-xs outline-none',
              minHeightClassName,
              disabled ? 'cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={disabled}
            value={value || ''}
            onChange={(e) => {
              const next = normalizeHtml(e.target.value);
              lastValueRef.current = next;
              onChange(next);
            }}
          />
        ) : (
          <div
            id={id}
            ref={ref}
            className={[
              'prose prose-sm max-w-none px-3 py-2 text-sm outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6',
              minHeightClassName,
              disabled ? 'cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={emit}
            onBlur={emit}
            onFocus={() => {
              // Ensure DOM is in sync when user focuses.
              const next = normalizeHtml(value);
              if (normalizeHtml(ref.current?.innerHTML ?? '') !== next) {
                setEditorHtml(next);
                lastValueRef.current = next;
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HtmlEditor;

