'use client'

import { useCallback, useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import DashboardShell, { type DashboardViewId } from '@/components/layout/DashboardShell'

export type { DashboardViewId }

interface PortfolioDashboardProps {
    chatSlot: ReactNode
    aboutSlot: ReactNode
    experienceSlot: ReactNode
    projectsSlot: ReactNode
    servicesSlot: ReactNode
    contactSlot: ReactNode
}

function resolveViewFromHash(hash: string): DashboardViewId {
    switch (hash.replace(/^#/, '')) {
        case 'about':
            return 'about'
        case 'experience':
            return 'experience'
        case 'projects':
            return 'projects'
        case 'services':
            return 'services'
        case 'contact':
            return 'contact'
        default:
            return 'chat'
    }
}

export default function PortfolioDashboard({
    chatSlot,
    aboutSlot,
    experienceSlot,
    projectsSlot,
    servicesSlot,
    contactSlot,
}: PortfolioDashboardProps) {
    const [activeView, setActiveView] = useState<DashboardViewId>('chat')

    useEffect(() => {
        const syncFromHash = () => {
            setActiveView(resolveViewFromHash(window.location.hash))
        }

        syncFromHash()
        window.addEventListener('hashchange', syncFromHash)
        return () => window.removeEventListener('hashchange', syncFromHash)
    }, [])

    const handleSelectView = useCallback((
        event: MouseEvent<HTMLAnchorElement>,
        viewId: DashboardViewId,
        hash: string
    ) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return
        }
        event.preventDefault()
        setActiveView(viewId)

        const targetHash = viewId === 'chat' ? '' : hash
        const nextUrl = targetHash ? `${window.location.pathname}${targetHash}` : window.location.pathname
        window.history.replaceState(null, '', nextUrl)
    }, [])

    return (
        <DashboardShell activeNav={activeView} onSelectHomeView={handleSelectView}>
            <div className={activeView === 'chat' ? 'dashboard-pane flex min-h-0 flex-1 flex-col' : 'hidden'}>
                {chatSlot}
            </div>

            <div className={activeView === 'about' ? 'dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll' : 'hidden'}>
                {aboutSlot}
            </div>

            <div className={activeView === 'experience' ? 'dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll' : 'hidden'}>
                {experienceSlot}
            </div>

            <div className={activeView === 'projects' ? 'dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll' : 'hidden'}>
                {projectsSlot}
            </div>

            <div className={activeView === 'services' ? 'dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll' : 'hidden'}>
                {servicesSlot}
            </div>

            <div className={activeView === 'contact' ? 'dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll' : 'hidden'}>
                {contactSlot}
            </div>
        </DashboardShell>
    )
}
