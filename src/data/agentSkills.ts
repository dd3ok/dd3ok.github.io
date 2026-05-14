import type { AgentSkill } from '@/types'

export const agentSkills: AgentSkill[] = [
    {
        id: 'naverstock-api-skill',
        title: 'NaverStock API Skill',
        description:
            '네이버증권(stock.naver.com) 비공식 읽기 전용 웹 API를 AI 에이전트가 안전하게 조회할 수 있도록 돕는 스킬입니다. 국내 주식 시세, 업종/테마/ETF, 뉴스, 리서치 데이터를 지원합니다.',
        shortDescription: '네이버증권 API 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/naverstock-api-skill',
        category: 'finance',
        keywords: [
            '네이버증권 API',
            'Naver Stock API',
            '국내 주식 시세',
            'ETF',
            '업종 테마',
        ],
    },
    {
        id: 'tossinvest-api-skill',
        title: 'TossInvest API Skill',
        description:
            '비공식 토스증권 API를 다루는 Agent Skill입니다. 공개 주식/시장 페이지에서 관찰되는 웹 내부 API를 안전하게 탐색하고 재조회합니다. 종목 요약, 현재가, 차트, 재무, 뉴스, 스크리너를 지원합니다.',
        shortDescription: '토스증권 API 스킬',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/tossinvest-api-skill',
        category: 'finance',
        keywords: [
            '토스증권 API',
            'TossInvest API',
            '주식 데이터',
            '재무제표',
            '스크리너',
        ],
    },
    {
        id: 'binance-api-skill',
        title: 'Binance API Skill',
        description:
            'Binance Spot REST API를 다루는 비공식 Codex/OpenAI 스킬입니다. 공식 문서 기반의 엔드포인트 라우팅, 서명 방식, 필터, 에러 코드, Testnet 안전 가이드를 제공합니다.',
        shortDescription: '바이낸스 API 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/binance-api-skill',
        category: 'finance',
        keywords: [
            'Binance API',
            '바이낸스 API',
            'crypto API',
            'Spot REST API',
            'trading',
        ],
    },
    {
        id: 'yahoo-finance-market-skill',
        title: 'Yahoo Finance Market Skill',
        description:
            'yfinance 라이브러리를 활용한 Yahoo Finance 시장 조사 Agent Skill입니다. 주가 조회, 재무제표, 차트 데이터, 글로벌 시장 데이터를 AI 에이전트에서 사용할 수 있습니다.',
        shortDescription: '야후 파이낸스 스킬',
        tech: ['Python', 'yfinance'],
        github: 'https://github.com/dd3ok/yahoo-finance-market-skill',
        category: 'finance',
        keywords: [
            'Yahoo Finance API',
            'yfinance',
            'stock market data',
            'financial data',
            'market research',
        ],
    },
    {
        id: 'document-briefing-cache-skill',
        title: 'Document Briefing Cache Skill',
        description:
            '문서를 구조화된 브리핑으로 변환하고 캐싱하는 스킬입니다. 핑거프린트 기반 캐시로 LLM 호출을 최소화하며, 한 번 요약하면 포맷 변환이나 반복 요청에 재사용합니다.',
        shortDescription: '문서 브리핑 캐시 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/document-briefing-cache-skill',
        category: 'productivity',
        keywords: [
            'document summarization',
            'LLM caching',
            'briefing',
            'agent skill',
            '문서 요약',
        ],
    },
    {
        id: 'new-session-handoff-skill',
        title: 'New Session Handoff Skill',
        description:
            '새 에이전트 세션에서 이전 작업을 이어갈 수 있도록 검증된 HANDOFF.md를 생성하는 스킬입니다. 채팅 히스토리 없이도 작업 컨텍스트를 안전하게 전달합니다.',
        shortDescription: '세션 핸드오프 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/new-session-handoff-skill',
        category: 'productivity',
        keywords: [
            'session handoff',
            'agent continuity',
            'HANDOFF.md',
            'coding agent',
            '세션 인수인계',
        ],
    },
    {
        id: 'watchlist-md',
        title: 'WATCHLIST.md',
        description:
            '리포지토리 로컬 WATCHLIST.md에 후속 확인 사항을 기록하는 경량 Agent Skill입니다. 데몬이나 cron 없이 AI 에이전트가 보류 중인 체크 항목을 구조화된 형식으로 관리합니다.',
        shortDescription: '워치리스트 관리 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/WATCHLIST.md',
        category: 'productivity',
        keywords: [
            'watchlist',
            'deferred checks',
            'agent skill',
            'developer tools',
            '후속 확인',
        ],
    },
]
