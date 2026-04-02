'use client';

import { useState } from 'react';

export function useOnlineStatus() {
    const [onlineUsers] = useState<Set<string>>(new Set());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isOnline = (username: string): boolean => {
        return false;
    };

    return { isOnline, onlineUsers };
}