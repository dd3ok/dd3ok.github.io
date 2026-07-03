import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import AgentSkillsSection from '@/components/sections/AgentSkillsSection'
import { agentSkills } from '@/data/agentSkills'

const pageDescription =
    'dd3ok가 공개한 AI Agent Skill 저장소 모음입니다. 세션 인수인계, 문서 브리핑, 실행 모호성 리뷰, 컨텍스트 정리, 시장 데이터 조회처럼 반복되는 에이전트 작업을 다룹니다.'

export const metadata: Metadata = {
    title: 'Open Source Agent Skills',
    description: pageDescription,
    keywords: [
        'agent skill',
        'codex skill',
        'openai skill',
        'AI coding agent',
        'session handoff',
        'document summarization',
        'context hygiene',
        'Naver Finance API',
        'TossInvest API',
        'Binance API skill',
        'Yahoo Finance skill',
        'Python',
        'open source',
    ],
    openGraph: {
        title: 'Open Source Agent Skills | dd3ok',
        description: pageDescription,
        url: 'https://dd3ok.github.io/agent-skills/',
        type: 'website',
        locale: 'ko_KR',
        images: [
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'dd3ok agent skills',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Open Source Agent Skills | dd3ok',
        description: pageDescription,
        images: ['/logo.png'],
    },
    alternates: {
        canonical: '/agent-skills/',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Open Source Agent Skills | dd3ok',
    description: pageDescription,
    url: 'https://dd3ok.github.io/agent-skills/',
    author: {
        '@type': 'Person',
        name: 'dd3ok',
        url: 'https://github.com/dd3ok',
    },
    mainEntity: {
        '@type': 'ItemList',
        itemListElement: agentSkills.map((skill, index) => ({
            '@type': 'SoftwareSourceCode',
            position: index + 1,
            name: skill.title,
            description: skill.description,
            codeRepository: skill.github,
            programmingLanguage: skill.tech.includes('Python') ? 'Python' : skill.tech[0],
        })),
    },
}

export default function AgentSkillsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen min-h-[100dvh] bg-[var(--bg-color)]">
                <Navigation />
                <AgentSkillsSection />
                <Footer />
            </main>
        </>
    )
}
