import { useEffect, useState } from 'react'

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const sections = ['hero', 'about', 'projects', 'experience', 'contact']

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const offsetTop = element.offsetTop
                    const height = element.offsetHeight

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // 초기 실행

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return activeSection
}
