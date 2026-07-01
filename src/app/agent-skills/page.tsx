import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import AgentSkillsSection from '@/components/sections/AgentSkillsSection'
import { agentSkills } from '@/data/agentSkills'

const agentSkillKeywords = Array.from(new Set([
    'agent skill',
    'codex skill',
    'openai skill',
    'AI coding agent',
    'Claude Code',
    'Python',
    'open source',
    ...agentSkills.flatMap((skill) => [
        skill.title,
        skill.shortDescription,
        ...skill.keywords,
    ]),
]))

export const metadata: Metadata = {
    title: 'Open Source Agent Skills',
    description:
        'dd3ok의 오픈소스 AI Agent Skill 모음입니다. 문서 점검, 세션 핸드오프, 컨텍스트 위생, 기술 탐색, 공개 시장 데이터 조회처럼 반복되는 에이전트 작업을 다룹니다.',
    keywords: agentSkillKeywords,
    openGraph: {
        title: 'Open Source Agent Skills | dd3ok',
        description:
            'Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 Agent Skill 저장소 모음입니다.',
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
        description:
            '문서 점검, 세션 핸드오프, 컨텍스트 위생, 기술 탐색, 공개 시장 데이터 조회를 위한 Agent Skill 모음입니다.',
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
    description:
        'Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 Agent Skill 저장소 모음',
    url: 'https://dd3ok.github.io/agent-skills/',
    author: {
        '@type': 'Person',
        name: 'dd3ok',
        url: 'https://github.com/dd3ok',
    },
    mainEntity: {
        '@type': 'ItemList',
        numberOfItems: agentSkills.length,
        itemListElement: agentSkills.map((skill, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'SoftwareSourceCode',
                name: skill.title,
                description: skill.shortDescription,
                codeRepository: skill.github,
                programmingLanguage: skill.tech[0] ?? 'Python',
                keywords: skill.keywords.join(', '),
            },
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
