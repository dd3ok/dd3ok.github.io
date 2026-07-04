import { useSyncExternalStore } from 'react'

const USER_ID_KEY = 'ai_chat_user_id'

function readUserId(): string | null {
    if (typeof window === 'undefined') {
        return null
    }

    return localStorage.getItem(USER_ID_KEY)
}

function ensureUserId(): string | null {
    if (typeof window === 'undefined') {
        return null
    }

    const storedUserId = localStorage.getItem(USER_ID_KEY)
    if (storedUserId) {
        return storedUserId
    }

    const nextUserId = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, nextUserId)
    return nextUserId
}

function subscribeUserId(onStoreChange: () => void) {
    if (typeof window === 'undefined') {
        return () => {}
    }

    const handleStorage = (event: StorageEvent) => {
        if (event.key === USER_ID_KEY) {
            onStoreChange()
        }
    }

    window.addEventListener('storage', handleStorage)
    const syncTimer = window.setTimeout(() => {
        ensureUserId()
        onStoreChange()
    }, 0)

    return () => {
        window.removeEventListener('storage', handleStorage)
        window.clearTimeout(syncTimer)
    }
}

export function useUserIdentifier(): string | null {
    return useSyncExternalStore(subscribeUserId, readUserId, () => null)
}
