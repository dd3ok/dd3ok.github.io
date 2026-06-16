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
        primary: 'bg-[var(--accent-color)] hover:bg-[var(--accent-secondary)] text-white focus:ring-[var(--accent-color)] hover:shadow-[0_0_15px_var(--accent-glow)]',
        outline: 'border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white focus:ring-[var(--accent-color)]',
        ghost: 'text-[var(--accent-color)] hover:bg-[var(--accent-glow)] focus:ring-[var(--accent-color)]'
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
