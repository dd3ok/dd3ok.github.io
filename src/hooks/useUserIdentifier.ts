import { useState, useEffect } from 'react';

const USER_ID_KEY = 'ai_chat_user_id';

export function useUserIdentifier(): string | null {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // localStorage는 브라우저 환경에서만 접근 가능하므로, useEffect 안에서 사용합니다.
        let storedUserId = localStorage.getItem(USER_ID_KEY);

        if (!storedUserId) {
            // 저장된 ID가 없으면 새로 생성하고 localStorage에 저장합니다.
            storedUserId = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, storedUserId);
            console.log('New user ID generated and stored:', storedUserId);
        } else {
            console.log('Existing user ID found:', storedUserId);
        }

        setUserId(storedUserId);
    }, []); // 이 useEffect는 컴포넌트가 처음 마운트될 때 딱 한 번만 실행됩니다.

    return userId;
}