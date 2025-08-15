'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { DataProvider } from '@/contexts/data-context';

export default function Providers({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return <AuthProvider><DataProvider>{children}</DataProvider></AuthProvider>;
}