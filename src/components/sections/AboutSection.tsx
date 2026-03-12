'use client'

import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import { aboutContent, skills } from '@/data/portfolio'

export default function AboutSection() {
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

    return (
        <section
            id="about"
            ref={sectionRef}
            className="section-padding bg-white"
        >
            <div className="container">
                <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        About Me
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {aboutContent.summaryTags.map((tag) => `#${tag}`).join(' ')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className={`${isVisible ? 'slide-in-left visible' : 'slide-in-left'}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {aboutContent.title}
                        </h3>
                        <div className="space-y-4 text-gray-600">
                            {aboutContent.paragraphs.map((paragraph) => (
                                <p key={paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className={`${isVisible ? 'slide-in-right visible' : 'slide-in-right'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            {skills.map((skillGroup) => (
                                <Card key={skillGroup.category} className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        {skillGroup.category}
                                    </h4>
                                    <div className="space-y-2">
                                        {skillGroup.items.map((skill) => (
                                            <div
                                                key={skill}
                                                className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block mr-2 mb-1"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
