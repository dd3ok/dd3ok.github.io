import { services } from '@/data/portfolio'

const navigableServices = services.filter((service) => (
    service.status !== 'coming_soon' &&
    service.id !== 'waitworthy'
))

export const sectionNavItems = [
    { id: 'hero', label: 'Home', type: 'section' },
    { id: 'about', label: 'About', type: 'section' },
    { id: 'experience', label: 'Experience', type: 'section' },
    { id: 'projects', label: 'Projects', type: 'section' },
    {
        id: 'services',
        label: 'Lab',
        type: 'dropdown',
        dropdown: [
            ...navigableServices.map((service) => ({
                id: service.id,
                label: service.navLabel ?? service.title,
                path: service.path,
            })),
        ],
    },
    { id: 'contact', label: 'Contact', type: 'section' },
] as const

export const waitworthyNavItem = { id: 'notes', label: 'Waitworthy', path: '/notes/' } as const
