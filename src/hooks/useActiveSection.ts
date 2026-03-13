import { useEffect, useState } from 'react'

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const sectionIds = ['hero', 'about', 'experience', 'projects', 'services', 'contact']
        const sectionElements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null)

        if (sectionElements.length === 0) {
            return
        }

        const visibleSections = new Map<string, number>()

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id

                    if (entry.isIntersecting) {
                        visibleSections.set(sectionId, entry.intersectionRatio)
                    } else {
                        visibleSections.delete(sectionId)
                    }
                })

                const nextActiveSection = sectionIds.find((id) => visibleSections.has(id))

                if (nextActiveSection) {
                    setActiveSection(nextActiveSection)
                }
            },
            {
                rootMargin: '-45% 0px -45% 0px',
                threshold: [0, 0.1, 0.25, 0.5],
            }
        )

        sectionElements.forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    return activeSection
}
