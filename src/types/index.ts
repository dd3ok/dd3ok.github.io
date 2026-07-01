export type ProjectDisplayGroup = 'primary' | 'related' | 'supporting'

export interface Project {
    title: string
    description: string
    tech: string[]
    image: string
    github: string
    demo: string
    displayGroup: ProjectDisplayGroup
    displayLabel: string
}

export interface Service {
    id: string
    title: string
    navLabel?: string
    status?: 'active' | 'coming_soon'
    description: string
    path: string
    features: string[]
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

export interface AgentSkill {
    id: string
    title: string
    description: string
    shortDescription: string
    tech: string[]
    github: string
    category: 'finance' | 'productivity'
    keywords: string[]
}

export interface NavItem {
    id: string
    label: string
}
