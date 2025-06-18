'use client';

import useHealthCheck from '@/hooks/useHealthCheck';

export function HealthcheckInitializer() {
    useHealthCheck();
    return null;
}