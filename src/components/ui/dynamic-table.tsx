'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, Search,
} from 'lucide-react';
import {Column, RecordType} from "@/types/table";

interface TableProps<T> {
    data?: T[] | null;
    columns: Column<T>[];
    pageSize?: number;
    searchable?: boolean;
    searchText?: string;
    onFilteredDataChange?: (filteredData: T[]) => void; // Yeni prop
}

const DynamicTable = <T extends RecordType>({
                                                data = [],
                                                columns,
                                                pageSize = 50,
                                                searchable = true,
                                                searchText = '',
                                                onFilteredDataChange, // Yeni prop
                                            }: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState(searchText);

    // Create a map of record IDs to rendered values to help with search
    const [renderedValuesMap, setRenderedValuesMap] = useState<Map<string, string[]>>(new Map());

    const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

    const sortedData = useMemo(() => {
        const sortableData = [...safeData];
        if (sortConfig) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [safeData, sortConfig]);

    // Extract all rendered values for each record as strings
    useEffect(() => {
        const newMap = new Map<string, string[]>();

        sortedData.forEach((item) => {
            const recordId = String(item.id); // Assuming each record has an id
            const renderedValues: string[] = [];

            // Add direct values
            Object.entries(item).forEach(([, value]) => {
                if (value !== undefined && value !== null) {
                    renderedValues.push(String(value).toLowerCase());
                }
            });

            // Add rendered values
            columns.forEach((column) => {
                if (column.render) {
                    try {
                        const baseValue = item[column.key as keyof typeof item];
                        const renderedOutput = column.render(baseValue, item);

                        // Handle React elements
                        if (renderedOutput && typeof renderedOutput === 'object') {
                            try {
                                // React elementi olup olmadığını kontrol et
                                const isReactElement =
                                    renderedOutput.hasOwnProperty('type') &&
                                    renderedOutput.hasOwnProperty('props');

                                if (isReactElement) {
                                    // TypeScript'i props özelliğine erişebilmemiz için ikna edelim
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const elementProps = (renderedOutput as { props?: Record<string, any> }).props;

                                    if (elementProps) {
                                        // Text içeriğini children'dan çıkaralım
                                        if (elementProps.children) {
                                            const children = Array.isArray(elementProps.children)
                                                ? elementProps.children
                                                : [elementProps.children];

                                            children.forEach(child => {
                                                if (typeof child === 'string') {
                                                    renderedValues.push(child.toLowerCase().trim());
                                                }
                                            });
                                        }

                                        // Metin olabilecek diğer props'ları kontrol edelim
                                        ['title', 'alt', 'label', 'placeholder', 'value'].forEach(prop => {
                                            if (typeof elementProps[prop] === 'string') {
                                                renderedValues.push(elementProps[prop].toLowerCase());
                                            }
                                        });
                                    }
                                } else {
                                    // Basit bir nesne ise, güvenli bir şekilde düzleştirelim
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const flattenObject = (obj: Record<string, any>, prefix = ''): void => {
                                        if(prefix === 'genixoai') return;
                                        Object.entries(obj).forEach(([, value]) => {
                                            // Özyinelemeli döngüleri önlemek için ziyaret edilmiş referansları takip edebilirsiniz
                                            // Basitlik için burada sadece ilkel değerleri işliyoruz
                                            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                                                renderedValues.push(String(value).toLowerCase());
                                            }
                                        });
                                    };

                                    try {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        flattenObject(renderedOutput as Record<string, any>);
                                    } catch (err) {
                                        console.error(err);
                                        // Nesneyi düzleştirirken hata oluşursa, sessizce devam et
                                    }
                                }
                            } catch (error) {
                                console.error("Error extracting text from React element:", error);
                            }
                        } else if (renderedOutput !== undefined && renderedOutput !== null) {
                            renderedValues.push(String(renderedOutput).toLowerCase());
                        }
                    } catch (error) {
                        console.error("Error in render function during search data extraction:", error);
                    }
                }
            });

            // Also find nested paths using a simple approach
            const recordStr = JSON.stringify(item);
            const allPaths = recordStr.match(/"([^"]+)":/g) || [];
            allPaths.forEach(path => {
                const key = path.replace(/^"|":$/g, '');
                try {
                    // Try to get nested values
                    const keyParts = key.split('.');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let currentValue: any = item;
                    let valid = true;

                    for (const part of keyParts) {
                        if (currentValue && typeof currentValue === 'object' && part in currentValue) {
                            currentValue = currentValue[part as keyof typeof currentValue];
                        } else {
                            valid = false;
                            break;
                        }
                    }

                    if (valid && currentValue !== undefined && currentValue !== null) {
                        renderedValues.push(String(currentValue).toLowerCase());
                    }
                } catch (e) {
                    console.log(e)
                    // Ignore errors in extraction
                }
            });

            // Store the rendered values for this record
            newMap.set(recordId, renderedValues);
        });

        setRenderedValuesMap(newMap);
    }, [sortedData, columns]);

    // Enhanced search functionality with pre-rendered values
    const filteredData = useMemo(() => {
        if (!searchTerm) return sortedData;

        const searchTermLower = searchTerm.toLowerCase();

        return sortedData.filter(item => {
            const recordId = String(item.id);
            const renderedValues = renderedValuesMap.get(recordId) || [];

            // Direct property search first (fast path)
            for (const key in item) {
                const value = item[key];
                if (value !== undefined &&
                    String(value).toLowerCase().includes(searchTermLower)) {
                    return true;
                }
            }

            // Then check pre-rendered values
            return renderedValues.some(value => value.includes(searchTermLower));
        });
    }, [sortedData, searchTerm, renderedValuesMap]);

    // Filtrelenmiş veri değiştiğinde parent component'e bildir
    const onFilteredDataChangeRef = useRef(onFilteredDataChange);
    onFilteredDataChangeRef.current = onFilteredDataChange;

    // Filtrelenmiş veri değiştiğinde parent component'e bildir - sadece search değiştiğinde
    useEffect(() => {
        if (onFilteredDataChangeRef.current) {
            onFilteredDataChangeRef.current(filteredData);
        }
    }, [searchTerm]); // Sadece search term değiştiğinde çalışır

    // İlk yüklemede de çalışması için
    useEffect(() => {
        if (onFilteredDataChangeRef.current && safeData.length > 0) {
            onFilteredDataChangeRef.current(filteredData);
        }
    }, [safeData.length]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: keyof T) => {
        const column = columns.find(col => col.key === key);
        if (!column?.sortable) return;
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    if (!safeData.length) {
        return (
            <div className="w-full text-center py-8 text-gray-500">
                No data available
            </div>
        );
    }

    const renderCell = (column: Column<T>, item: T) => {
        if (column.key === 'actions' && column.actions) {
            return (
                <div className="flex items-center space-x-2">
                    {column.actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => action.onClick(item)}
                            className={`p-1 rounded hover:bg-gray-100 ${action.className || ''}`}
                            title={action.label}
                        >
                            {action.icon ? <action.icon className="h-4 w-4" /> : action.label}
                        </button>
                    ))}
                </div>
            );
        }

        const value = item[column.key as keyof T];
        return column.render ? column.render(value, item) : String(value);
    };

    const showPagination = filteredData.length > pageSize;

    return (
        <div className="w-full">
            {searchable && (
                <div className="mb-4 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="ml-2 p-2 border rounded w-full"
                    />
                </div>
            )}

            <div className="overflow-x-auto border rounded ">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={`${String(column.key)}-${index}`}
                                onClick={() => column.key !== 'actions' && handleSort(column.key as keyof T)}
                                className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                    column.sortable && column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                                }`}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {column.sortable && column.key !== 'actions' && (
                                        <span className="ml-2">
                        {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-200" />
                        )}
                      </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={`${String(column.key)}-${colIndex}`}
                                    className="px-4 py-2 whitespace-nowrap"
                                >
                                    {renderCell(column, item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showPagination && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="px-4">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicTable;