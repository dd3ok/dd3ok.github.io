import Link from 'next/link'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'primary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    onClick?: () => void
    type?: 'button' | 'submit'
    href?: string
}

export default function Button({
                                   children,
                                   variant = 'primary',
                                   size = 'md',
                                   className = '',
                                   onClick,
                                   type = 'button',
                                   href
                               }: ButtonProps) {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
        ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    const composedClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

    if (href) {
        if (href.startsWith('/')) {
            return (
                <Link href={href} className={composedClassName}>
                    {children}
                </Link>
            )
        }

        return (
            <a href={href} className={composedClassName}>
                {children}
            </a>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={composedClassName}
        >
            {children}
        </button>
    )
}
