import { useEffect, useState } from 'react';

const USER_ID_KEY = 'ai_chat_user_id';

function createInitialUserId(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem(USER_ID_KEY) ?? crypto.randomUUID();
}

export function useUserIdentifier(): string | null {
    const [userId] = useState<string | null>(createInitialUserId);

    useEffect(() => {
        if (userId && localStorage.getItem(USER_ID_KEY) !== userId) {
            localStorage.setItem(USER_ID_KEY, userId);
        }
    }, [userId]);

    return userId;
}
