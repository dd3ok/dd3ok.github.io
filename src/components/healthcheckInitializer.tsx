'use client';

import useHealthCheck from '@/hooks/useHealthCheck';

export function HealthCheckInitializer() {
    useHealthCheck();
    return null;
}