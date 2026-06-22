import type { MetadataRoute } from 'next'
import { getPublicNotes, noteCategories } from '@/lib/notes'

const siteUrl = 'https://dd3ok.github.io'

export const dynamic = 'force-static'

const absoluteUrl = (pathname: string) => `${siteUrl}${pathname}`

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl('/'),
            lastModified: new Date('2026-06-22'),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: absoluteUrl('/agent-skills/'),
            lastModified: new Date('2026-06-22'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: absoluteUrl('/notes/'),
            lastModified: new Date('2026-06-22'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ]

    const categoryRoutes: MetadataRoute.Sitemap = noteCategories.map((category) => ({
        url: absoluteUrl(`/notes/${category.id}/`),
        lastModified: new Date('2026-06-22'),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    const noteRoutes: MetadataRoute.Sitemap = getPublicNotes().map((note) => ({
        url: absoluteUrl(`/notes/post/${note.slug}/`),
        lastModified: new Date(`${note.updated ?? note.date}T00:00:00+09:00`),
        changeFrequency: note.status === 'evergreen' ? 'monthly' : 'weekly',
        priority: note.status === 'draft' ? 0.5 : 0.8,
    }))

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...noteRoutes,
    ]
}
