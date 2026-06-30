import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import AgentSkillsSection from '@/components/sections/AgentSkillsSection'

export const metadata: Metadata = {
    title: 'Open Source Agent Skills',
    description:
        'dd3ok의 오픈소스 AI Agent Skill 모음: 네이버증권 API, 토스증권 API, 바이낸스 API, 야후 파이낸스, 문서 브리핑 캐시, 세션 핸드오프, WATCHLIST.md. Codex와 Claude Code에서 쓰는 Python 기반 스킬.',
    keywords: [
        'agent skill',
        'codex skill',
        'openai skill',
        'AI coding agent',
        '네이버증권 API',
        '토스증권 API',
        'Binance API skill',
        'Yahoo Finance skill',
        'document summarization',
        'session handoff',
        'WATCHLIST.md',
        'Python',
        'open source',
    ],
    openGraph: {
        title: 'Open Source Agent Skills | dd3ok',
        description:
            'AI 코딩 에이전트(Codex, Claude Code)에서 쓰는 오픈소스 스킬 모음. 금융 데이터 API부터 생산성 도구까지.',
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
            'AI 코딩 에이전트에서 쓰는 오픈소스 스킬 모음: 네이버증권, 토스증권, 바이낸스, 야후 파이낸스 API 외 생산성 도구.',
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
        'AI 코딩 에이전트(Codex, Claude Code)에서 쓰는 오픈소스 Python 스킬 모음',
    url: 'https://dd3ok.github.io/agent-skills/',
    author: {
        '@type': 'Person',
        name: 'dd3ok',
        url: 'https://github.com/dd3ok',
    },
    mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
            {
                '@type': 'SoftwareSourceCode',
                position: 1,
                name: 'NaverStock API Skill',
                description:
                    '네이버증권 비공식 읽기 전용 웹 API Agent Skill: 국내 주식 시세, 업종/테마/ETF, 뉴스, 리서치 데이터',
                codeRepository: 'https://github.com/dd3ok/naverstock-api-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 2,
                name: 'TossInvest API Skill',
                description:
                    '비공식 토스증권 API Agent Skill: 종목 요약, 현재가, 차트, 재무, 뉴스, 스크리너',
                codeRepository: 'https://github.com/dd3ok/tossinvest-api-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 3,
                name: 'Binance API Skill',
                description:
                    'Unofficial Codex/OpenAI skill for Binance Spot REST API: endpoints, signing, rate limits, filters, errors, Testnet safety',
                codeRepository: 'https://github.com/dd3ok/binance-api-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 4,
                name: 'Yahoo Finance Market Skill',
                description:
                    'Agent Skill for Yahoo Finance market research via yfinance: stock quotes, financials, charts, market data',
                codeRepository:
                    'https://github.com/dd3ok/yahoo-finance-market-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 5,
                name: 'Document Briefing Cache Skill',
                description:
                    'Agent skill for caching structured document briefings: summarize once, reuse everywhere',
                codeRepository:
                    'https://github.com/dd3ok/document-briefing-cache-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 6,
                name: 'New Session Handoff Skill',
                description:
                    'Agent skill for creating verified HANDOFF.md so coding work continues in a fresh session',
                codeRepository:
                    'https://github.com/dd3ok/new-session-handoff-skill',
                programmingLanguage: 'Python',
            },
            {
                '@type': 'SoftwareSourceCode',
                position: 7,
                name: 'WATCHLIST.md',
                description:
                    'Lightweight agent skill for recording deferred follow-up checks in repository-local WATCHLIST.md',
                codeRepository: 'https://github.com/dd3ok/WATCHLIST.md',
                programmingLanguage: 'Python',
            },
        ],
    },
}

export default function AgentSkillsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-[100dvh] bg-[var(--bg-color)]">
                <Navigation />
                <AgentSkillsSection />
                <Footer />
            </main>
        </>
    )
}
