import type { ReactNode } from 'react'

type StatusTone = 'success' | 'error' | 'warning' | 'info'

interface StatusToneConfig {
    container: string
    icon: string
    title: string
    description: string
    role: 'status' | 'alert'
    live: 'polite' | 'assertive'
    iconPath: ReactNode
}

interface StatusBannerProps {
    tone: StatusTone
    title: ReactNode
    description?: ReactNode
    className?: string
    role?: 'status' | 'alert'
    live?: 'polite' | 'assertive'
    children?: ReactNode
}

const toneConfig: Record<StatusTone, StatusToneConfig> = {
    success: {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-400',
        title: 'text-green-800',
        description: 'text-green-700',
        role: 'status',
        live: 'polite',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        ),
    },
    error: {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-400',
        title: 'text-red-800',
        description: 'text-red-700',
        role: 'alert',
        live: 'assertive',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
            />
        ),
    },
    warning: {
        container: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-400',
        title: 'text-amber-800',
        description: 'text-amber-700',
        role: 'status',
        live: 'polite',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.591c.75 1.334-.213 2.99-1.742 2.99H3.48c-1.53 0-2.492-1.656-1.743-2.99L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        ),
    },
    info: {
        container: 'bg-slate-50 border-slate-200',
        icon: 'text-slate-400',
        title: 'text-slate-800',
        description: 'text-slate-700',
        role: 'status',
        live: 'polite',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0 1 1 0 002 0zm-2 3a1 1 0 000 2v3a1 1 0 102 0v-3a1 1 0 00-2-2z"
                clipRule="evenodd"
            />
        ),
    },
}

export default function StatusBanner({
    tone,
    title,
    description,
    className = '',
    role,
    live,
    children,
}: StatusBannerProps) {
    const config = toneConfig[tone]

    return (
        <div
            className={`rounded-xl border p-3 md:p-4 ${config.container} ${className}`.trim()}
            role={role ?? config.role}
            aria-live={live ?? config.live}
            aria-atomic="true"
        >
            <div className="flex items-start">
                <div className="mt-0.5 flex-shrink-0">
                    <svg className={`h-4 w-4 md:h-5 md:w-5 ${config.icon}`} viewBox="0 0 20 20" fill="currentColor">
                        {config.iconPath}
                    </svg>
                </div>
                <div className="ml-3">
                    <p className={`text-sm font-medium ${config.title}`}>{title}</p>
                    {description && (
                        <p className={`mt-1 text-xs md:text-sm ${config.description}`}>
                            {description}
                        </p>
                    )}
                    {children && <div className="mt-3">{children}</div>}
                </div>
            </div>
        </div>
    )
}
