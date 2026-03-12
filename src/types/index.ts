export interface Project {
    title: string
    description: string
    tech: string[]
    image: string
    github: string
    demo: string
    featured?: boolean
}

export interface Service {
    title: string
    description: string
    icon: string
    path: string
    features: string[]
    color: string
    buttonText: string
    buttonType: 'service' | 'repo'
}

export interface Experience {
    company: string
    position: string
    period: string
    description: string[]
    technologies?: string[]
}

export interface Skill {
    category: string
    items: string[]
}

export interface AboutContent {
    summaryTags: string[]
    title: string
    paragraphs: string[]
}

export interface ContactInfo {
    email: string
    github: string
    linkedin: string
    phone?: string
}

export interface NavItem {
    id: string
    label: string
}
