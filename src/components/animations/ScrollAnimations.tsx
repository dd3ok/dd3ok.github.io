'use client'

import { useEffect, useRef } from 'react'

interface ScrollAnimationProps {
    children: React.ReactNode
    animation?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp'
    delay?: number
    className?: string
}

export default function ScrollAnimation({
                                            children,
                                            animation = 'fade',
                                            delay = 0,
                                            className = ''
                                        }: ScrollAnimationProps) {
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.classList.add('visible')
                    }, delay)
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [delay])

    const animationClasses = {
        fade: 'fade-in',
        slideLeft: 'slide-in-left',
        slideRight: 'slide-in-right',
        slideUp: 'slide-in-up'
    }

    return (
        <div
            ref={elementRef}
            className={`${animationClasses[animation]} ${className}`}
        >
            {children}
        </div>
    )
}
