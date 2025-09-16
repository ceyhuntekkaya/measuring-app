"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

interface AlertDialogContentProps {
    className?: string
    children: React.ReactNode
}

interface AlertDialogHeaderProps {
    className?: string
    children: React.ReactNode
}

interface AlertDialogFooterProps {
    className?: string
    children: React.ReactNode
}

interface AlertDialogTitleProps {
    className?: string
    children: React.ReactNode
}

interface AlertDialogDescriptionProps {
    className?: string
    children: React.ReactNode
}

interface AlertDialogActionProps {
    className?: string
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}

interface AlertDialogCancelProps {
    className?: string
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}

const AlertDialogContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
}>({
    open: false,
    onOpenChange: () => {}
})

const AlertDialog: React.FC<AlertDialogProps> = ({
                                                     open = false,
                                                     onOpenChange = () => {},
                                                     children
                                                 }) => {
    return (
        <AlertDialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </AlertDialogContext.Provider>
    )
}

const AlertDialogTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    return (
        <div onClick={() => onOpenChange(true)}>
            {children}
        </div>
    )
}

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
                                                                   className,
                                                                   children
                                                               }) => {
    const { open, onOpenChange } = React.useContext(AlertDialogContext)

    // ESC tuşu ile kapatma
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false)
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [open, onOpenChange])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div
                className={cn(
                    "relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 space-y-4 transform transition-all duration-200 scale-100",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
                                                                 className,
                                                                 children
                                                             }) => (
    <div className={cn("space-y-2", className)}>
        {children}
    </div>
)

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
                                                                 className,
                                                                 children
                                                             }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0", className)}>
        {children}
    </div>
)

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
                                                               className,
                                                               children
                                                           }) => (
    <h2 className={cn("text-lg font-semibold text-gray-900", className)}>
        {children}
    </h2>
)

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
                                                                           className,
                                                                           children
                                                                       }) => (
    <p className={cn("text-sm text-gray-600", className)}>
        {children}
    </p>
)

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
                                                                 className,
                                                                 children,
                                                                 onClick,
                                                                 disabled = false
                                                             }) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
        onOpenChange(false)
    }

    return (
        <Button
            onClick={handleClick}
            disabled={disabled}
            className={cn("", className)}
        >
            {children}
        </Button>
    )
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
                                                                 className,
                                                                 children,
                                                                 onClick,
                                                                 disabled = false
                                                             }) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
        onOpenChange(false)
    }

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            disabled={disabled}
            className={cn("mt-2 sm:mt-0", className)}
        >
            {children}
        </Button>
    )
}

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}