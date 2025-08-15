'use client';

import {useRouter} from 'next/navigation';
import {useAuthContext} from '@/contexts/auth-context';


export default function UnauthorizedPage() {
    const router = useRouter();
    const {getPathByRole} = useAuthContext();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        You dont have permission to access this page.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push(getPathByRole())}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}