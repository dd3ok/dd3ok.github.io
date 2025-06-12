// /app/etfs/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {message}
            </p>
        </div>
    );
}
