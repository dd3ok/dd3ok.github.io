'use client'

import { useEffect, useRef, useState } from 'react'

interface SectionWrapperProps {
    children: React.ReactNode
    id: string
    className?: string
    background?: 'white' | 'gray' | 'gradient'
}

export default function SectionWrapper({
                                           children,
                                           id,
                                           className = '',
                                           background = 'white'
                                       }: SectionWrapperProps) {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const backgroundClasses = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }

    return (
        <section
            id={id}
            ref={sectionRef}
            className={`section-padding ${backgroundClasses[background]} ${className}`}
            data-visible={isVisible}
        >
            {children}
        </section>
    )
}
