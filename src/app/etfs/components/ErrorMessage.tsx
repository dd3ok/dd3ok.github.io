// /app/etfs/components/ErrorMessage.tsx
interface ErrorMessageProps {
    title: string;
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
    return (
        <div className="text-center p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {title}
            </h2>
            <p className="text-base mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    다시 시도
                </button>
            )}
        </div>
    );
}
