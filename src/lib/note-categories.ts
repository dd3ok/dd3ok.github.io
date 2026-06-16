export interface NoteCategory {
    id: string
    title: string
    aliases?: string[]
}

export interface NoteCategoryMatch {
    category: string
    type?: string
    domain?: string
    tags: string[]
}

export const noteCategories: NoteCategory[] = [
    {
        id: 'ai-tools',
        title: 'AI & Tools',
        aliases: ['ai', 'tools', 'ai-workflow', 'agent', 'agents'],
    },
    {
        id: 'tech',
        title: 'Tech',
    },
    {
        id: 'business',
        title: 'Business',
    },
    {
        id: 'finance',
        title: 'Finance',
    },
    {
        id: 'learning',
        title: 'Learning',
    },
    {
        id: 'life',
        title: 'Life',
    },
    {
        id: 'health',
        title: 'Health',
        aliases: ['health-longevity', 'longevity', 'exercise'],
    },
    {
        id: 'insights',
        title: 'Insights',
        aliases: ['insight', 'research-notes', 'notes'],
    },
    {
        id: 'other',
        title: 'Other',
    },
]

export const allNotesCategory: NoteCategory = {
    id: 'all',
    title: 'All',
}

export const noteFilterCategories: NoteCategory[] = [
    allNotesCategory,
    ...noteCategories,
]

export const getNotesForCategory = <TNote extends NoteCategoryMatch>(
    notes: TNote[],
    category: NoteCategory
) => {
    if (category.id === allNotesCategory.id) {
        return notes
    }

    const categoryKeys = new Set([
        category.id,
        ...(category.aliases ?? []),
    ])

    return notes.filter((note) => (
        categoryKeys.has(note.category) ||
        Boolean(note.domain && categoryKeys.has(note.domain)) ||
        Boolean(note.type && categoryKeys.has(note.type)) ||
        note.tags.some((tag) => categoryKeys.has(tag))
    ))
}

export const getNoteCategoryById = (id: string) => {
    return noteCategories.find((category) => category.id === id)
}

export const getStaticNoteCategorySlugs = () => {
    return noteCategories.map((category) => category.id)
}
