'use client';

import { useProtectedRoute } from '@/hooks/use-auth';

export default function UserDashboard() {
    const { user, isAuthorized } = useProtectedRoute('USER', ['APPROVAL']);

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
            {/* User içeriği */}
        </div>
    );
}