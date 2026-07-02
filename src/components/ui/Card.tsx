interface CardProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export default function Card({ children, className = '', style }: CardProps) {
    return (
        <div
            className={`rounded-2xl transition-colors duration-300 ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}
