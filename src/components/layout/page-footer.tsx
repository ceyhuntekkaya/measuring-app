'use client';

interface PageFooterProps {
    actions?: React.ReactNode;
}

export default function PageFooter({ actions }: PageFooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="w-full px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Sol taraf - Logo */}
                    <div className="flex-shrink-0 w-1/4">
                        <span className="text-lg font-bold text-blue-600">
                            E-YADİS
                        </span>
                    </div>

                    {/* Orta - Actions */}
                    <div className="flex-1 flex items-center justify-center">
                        {actions && (
                            <div className="flex items-center space-x-2">
                                {actions}
                            </div>
                        )}
                    </div>

                    {/* Sağ taraf - Copyright */}
                    <div className="flex-shrink-0 w-1/4 flex justify-end">
                        <span className="text-sm text-gray-500">
                            © {currentYear} Tüm hakları saklıdır
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}