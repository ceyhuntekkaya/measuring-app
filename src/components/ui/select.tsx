'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

export type SelectValue = string | number;
export type SelectValues = SelectValue[];

interface SelectContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    onValueChange: (value: SelectValue) => void;
    value: SelectValue | SelectValues;
    multiple: boolean;
    disabled: boolean;
    searchable: boolean;
    searchQuery: string;
    onSearch: (query: string) => void;
    sortable: boolean;
    sortDirection: 'asc' | 'desc';
    toggleSort: () => void;
    getDisplayValue: (value: SelectValue) => React.ReactNode;
    registerOption: (value: SelectValue, label: React.ReactNode) => void;
    labelMap: Record<string, React.ReactNode>;
}

interface SelectProps {
    children: ReactNode;
    onValueChange: (value: SelectValue | SelectValues) => void;
    value: SelectValue | SelectValues;
    multiple?: boolean;
    disabled?: boolean;
    searchable?: boolean;
    sortable?: boolean;
    className?: string;
    onButtonEvent?: () => void;
    buttonText?: string;
}

interface SelectTriggerProps {
    className?: string;
    children: ReactNode;
}

interface SelectValueProps {
    placeholder?: string;
}

interface SelectContentProps {
    children: ReactNode;
    className?: string;
}

interface SelectGroupProps {
    label?: string;
    children: ReactNode;
    className?: string;
}

interface SelectItemProps {
    value: SelectValue;
    children: ReactNode;
    className?: string;
}

const collectSelectItems = (children: ReactNode): Record<string, React.ReactNode> => {
    const items: Record<string, React.ReactNode> = {};

    interface BasicProps {
        children?: ReactNode;
        [key: string]: unknown;
    }

    interface ItemProps extends BasicProps {
        value: SelectValue;
    }

    const processChild = (child: ReactNode) => {
        if (!React.isValidElement(child)) return;

        const childElement = child as React.ReactElement<BasicProps>;
        const childType = childElement.type;

        if (childType === SelectItem) {
            const props = childElement.props as ItemProps;
            items[String(props.value)] = props.children;
        }
        else if (childType === SelectGroup) {
            const props = childElement.props;
            if (props.children) {
                React.Children.forEach(props.children, processChild);
            }
        }
        else if (childElement.props && 'children' in childElement.props) {
            React.Children.forEach(childElement.props.children, processChild);
        }
    };

    React.Children.forEach(children, processChild);
    return items;
};

const SelectContext = createContext<SelectContextType>({} as SelectContextType);

export const Select: React.FC<SelectProps> = ({
                                                  children,
                                                  onValueChange,
                                                  value,
                                                  multiple = false,
                                                  disabled = false,
                                                  searchable = true,
                                                  sortable = true,
                                                  className = '',
                                                  onButtonEvent,
                                                  buttonText = '+',
                                              }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedValues, setSelectedValues] = useState<SelectValue | SelectValues>(
        multiple ? (Array.isArray(value) ? value : []) : (value !== undefined && value !== null ? value : '')
    );
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [optionsMap, setOptionsMap] = useState<Record<string, React.ReactNode>>({});

    const itemsRef = useRef<Record<string, React.ReactNode>>({});

    useEffect(() => {
        itemsRef.current = collectSelectItems(children);
        setOptionsMap(itemsRef.current);
    }, [children]);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValues(
                multiple ? (Array.isArray(value) ? value : []) : (value !== null ? value : '')
            );
        }
    }, [value, multiple]);

    const handleValueChange = useCallback((newValue: SelectValue) => {
        if (multiple) {
            const currentValues = selectedValues as SelectValues;
            const updatedValues = currentValues.includes(newValue)
                ? currentValues.filter(v => v !== newValue)
                : [...currentValues, newValue];
            setSelectedValues(updatedValues);
            onValueChange(updatedValues);
        } else {
            setSelectedValues(newValue);
            onValueChange(newValue);
            setOpen(false);
        }
    }, [multiple, selectedValues, onValueChange]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const toggleSort = useCallback(() => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    const registerOption = useCallback((value: SelectValue, label: React.ReactNode) => {
        setOptionsMap(prev => ({
            ...prev,
            [String(value)]: label
        }));
    }, []);

    const getDisplayValue = useCallback((value: SelectValue): React.ReactNode => {
        return optionsMap[String(value)] || String(value);
    }, [optionsMap]);

    const handleButtonClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onButtonEvent?.();
    }, [onButtonEvent]);

    return (
        <SelectContext.Provider value={{
            open,
            setOpen,
            onValueChange: handleValueChange,
            value: selectedValues,
            multiple,
            disabled,
            searchable,
            searchQuery,
            onSearch: handleSearch,
            sortable,
            sortDirection,
            toggleSort,
            getDisplayValue,
            registerOption,
            labelMap: optionsMap
        }}>
            <div className={`relative ${onButtonEvent ? 'flex gap-1' : ''} ${className}`}>
                <div className={`relative ${onButtonEvent ? 'flex-1' : 'w-full'}`}>
                    {children}
                </div>
                {onButtonEvent && (
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className={`flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:border-gray-400'
                        }`}
                        style={{
                            width: '38px',
                            height: '38px',
                            minWidth: '38px'
                        }}
                        disabled={disabled}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = '', children }) => {
    const { open, setOpen, disabled } = useContext(SelectContext);

    return (
        <button
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            className={`w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'
            } ${className}`}
            disabled={disabled}
        >
            {children}
            <svg
                className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = 'Seçiniz...' }) => {
    const { value, multiple, getDisplayValue, labelMap } = useContext(SelectContext);

    if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        return <span className="text-gray-400">{placeholder}</span>;
    }

    if (multiple) {
        return <span>{(value as SelectValues).length} öğe seçildi</span>;
    }

    const itemValue = value as SelectValue;
    const display = labelMap[String(itemValue)] || getDisplayValue(itemValue);

    return <span>{display}</span>;
};

export const SelectContent: React.FC<SelectContentProps> = ({ children, className = '' }) => {
    const {
        open,
        setOpen,
        searchable,
        onSearch,
        sortable,
        sortDirection,
        toggleSort
    } = useContext(SelectContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpen]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg ${className}`}
        >
            {(searchable || sortable) && (
                <div className="p-2 border-b border-gray-200 flex items-center gap-2">
                    {searchable && (
                        <input
                            type="text"
                            placeholder="Ara..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    {sortable && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSort();
                            }}
                            className="p-1 hover:bg-gray-100 rounded-md"
                        >
                            <svg
                                className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h6" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            <div className="overflow-auto max-h-60">
                {children}
            </div>
        </div>
    );
};

export const SelectGroup: React.FC<SelectGroupProps> = ({ label, children, className = '' }) => {
    const { searchQuery, sortDirection } = useContext(SelectContext);

    interface SelectItemElement extends React.ReactElement {
        props: {
            children: ReactNode;
            value: SelectValue;
        };
    }

    const filteredAndSortedChildren = React.Children.toArray(children)
        .filter((child): child is SelectItemElement => {
            if (!searchQuery) return true;
            if (React.isValidElement(child)) {
                const item = child as SelectItemElement;
                const childText = item.props.children?.toString().toLowerCase() || '';
                return childText.includes(searchQuery.toLowerCase());
            }
            return false;
        })
        .sort((a, b) => {
            const itemA = a as SelectItemElement;
            const itemB = b as SelectItemElement;
            const textA = itemA.props.children?.toString() || '';
            const textB = itemB.props.children?.toString() || '';
            return sortDirection === 'asc'
                ? textA.localeCompare(textB)
                : textB.localeCompare(textA);
        });

    if (filteredAndSortedChildren.length === 0) return null;

    return (
        <div className={`py-1 ${className}`}>
            {label && (
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </div>
            )}
            {filteredAndSortedChildren}
        </div>
    );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className = '' }) => {
    const { onValueChange, value: selectedValue, multiple, registerOption } = useContext(SelectContext);
    const isSelected = multiple
        ? (selectedValue as SelectValues).includes(value)
        : selectedValue === value;

    useEffect(() => {
        registerOption(value, children);
    }, [value, children, registerOption]);

    return (
        <div
            onClick={() => onValueChange(value)}
            className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                isSelected
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-900 hover:bg-gray-100'
            } ${className}`}
        >
            <span>{children}</span>
            {isSelected && (
                <svg
                    className="h-4 w-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </div>
    );
};