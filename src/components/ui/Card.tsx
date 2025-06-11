interface CardProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export default function Card({ children, className = '', style }: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}
