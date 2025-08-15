import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TabsContextProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
                                              defaultValue,
                                              value,
                                              onValueChange,
                                              children,
                                              className,
                                          }) => {
    const [activeTab, setActiveTabInternal] = useState(value || defaultValue);

    const setActiveTab = (tabValue: string) => {
        if (onValueChange) {
            onValueChange(tabValue);
        }
        if (value === undefined) {
            setActiveTabInternal(tabValue);
        }
    };

    const contextValue = {
        activeTab: value !== undefined ? value : activeTab,
        setActiveTab,
    };

    return (
        <TabsContext.Provider value={contextValue}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({
                                                      children,
                                                      className,
                                                  }) => {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
                className
            )}
        >
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
                                                            value,
                                                            children,
                                                            className,
                                                            disabled = false,
                                                        }) => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabsTrigger must be used within a Tabs component");
    }

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900",
                className
            )}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
                                                            value,
                                                            children,
                                                            className,
                                                        }) => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabsContent must be used within a Tabs component");
    }

    const { activeTab } = context;
    const isActive = activeTab === value;

    if (!isActive) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            tabIndex={0}
            className={cn("mt-2 focus:outline-none", className)}
        >
            {children}
        </div>
    );
};