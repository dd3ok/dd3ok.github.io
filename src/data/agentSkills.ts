import type { AgentSkill } from '@/types'

export const agentSkills: AgentSkill[] = [
    {
        id: 'document-briefing-cache-skill',
        title: 'Document Briefing Cache Skill',
        description:
            '문서를 구조화된 브리핑으로 요약하고 지문 기반 캐시에 저장하는 Agent Skill입니다. 같은 문서를 반복해서 요약하지 않고, 검증된 브리핑을 재사용해 LLM 호출과 컨텍스트 낭비를 줄입니다.',
        shortDescription: '문서 브리핑 캐시',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/document-briefing-cache-skill',
        category: 'workflow',
        keywords: [
            'document summarization',
            'LLM caching',
            'briefing',
            'agent skill',
            '문서 요약',
        ],
    },
    {
        id: 'watchlist-md',
        title: 'WATCHLIST.md',
        description:
            '리포지토리 로컬 WATCHLIST.md에 후속 확인 사항을 기록하는 경량 Agent Skill입니다. 데몬이나 cron 없이 AI 에이전트가 보류 중인 체크 항목을 구조화된 형식으로 관리합니다.',
        shortDescription: '후속 확인 관리',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/WATCHLIST.md',
        category: 'workflow',
        keywords: [
            'watchlist',
            'deferred checks',
            'agent skill',
            'developer tools',
            '후속 확인',
        ],
    },
    {
        id: 'savepoint',
        title: 'Savepoint',
        description:
            '코딩 에이전트 작업을 .savepoint/SAVEPOINT.md에 복구 가능한 체크포인트로 남기는 Agent Skill입니다. 컨텍스트 압축, 세션 전환, 리셋 이후에도 이어서 작업할 수 있는 최소 상태를 검증합니다.',
        shortDescription: '작업 세이브포인트',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/savepoint',
        category: 'workflow',
        keywords: [
            'savepoint',
            'session recovery',
            'coding agent',
            'handoff',
            '세이브포인트',
        ],
    },
    {
        id: 'newbie-lens',
        title: 'Newbie Lens',
        description:
            'SOP, PRD, 런북, 티켓, 핸드오프 문서를 초심자나 가벼운 모델이 그대로 실행할 때 막히는 지점을 찾는 Agent Skill입니다. 스타일이 아니라 실행을 막는 모호함만 좁게 리뷰합니다.',
        shortDescription: '실행 모호성 리뷰',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/newbie-lens',
        category: 'review',
        keywords: [
            'document review',
            'ambiguity',
            'runbook',
            'PRD',
            '초심자 관점',
        ],
    },
    {
        id: 'rabbit-hole',
        title: 'Rabbit Hole',
        description:
            '낯선 코드, 새 API, 모호한 기능, 원인 분석처럼 불확실성이 큰 작업에서 작은 검증 산출물을 먼저 만드는 Agent Skill입니다. 큰 구현 전에 최소 재현, 스파이크, 테스트로 방향을 확인합니다.',
        shortDescription: '탐색형 검증',
        tech: ['Prompt', 'Codex', 'Research'],
        github: 'https://github.com/dd3ok/rabbit-hole',
        category: 'research',
        keywords: [
            'root cause',
            'spike',
            'prototype',
            'debugging',
            '탐색',
        ],
    },
    {
        id: 'lucid',
        title: 'Lucid',
        description:
            '에이전트가 읽는 문맥의 부채를 스캔하고 정리 계획을 만드는 Agent Skill입니다. 오래된 지침, 충돌하는 문서, 비대한 AGENTS.md, skill 설명을 점검해 안전한 cleanup 계획으로 바꿉니다.',
        shortDescription: '컨텍스트 정리',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/lucid',
        category: 'review',
        keywords: [
            'context hygiene',
            'prompt debt',
            'AGENTS.md',
            'cleanup plan',
            '문맥 정리',
        ],
    },
    {
        id: 'naverstock-api-skill',
        title: 'NaverStock API Skill',
        description:
            '네이버증권(stock.naver.com) 공개 read-only 웹 API를 AI 에이전트가 안전하게 조회하도록 정리한 Agent Skill입니다. 국내 주식 시세, 업종/테마/ETF, 뉴스, 리서치 데이터를 지원합니다.',
        shortDescription: '네이버증권 API',
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
            '비공식 토스증권 공개 API를 다루는 Agent Skill입니다. 로그인이나 계좌 인증 없이 공개 주식·시장 페이지에서 관찰되는 API를 안전하게 탐색하고 재사용합니다.',
        shortDescription: '토스증권 API',
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
            'Binance Spot REST API를 다루는 비공식 Codex/OpenAI Agent Skill입니다. 공식 문서 기반으로 엔드포인트, 서명 방식, rate limit, 필터, 에러 코드, Testnet 안전 가이드를 제공합니다.',
        shortDescription: '바이낸스 API',
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
            'yfinance 라이브러리를 사용하는 Yahoo Finance 시장 조사 Agent Skill입니다. 주가 조회, 재무제표, 차트 데이터처럼 글로벌 시장 데이터를 AI 에이전트에서 다룹니다.',
        shortDescription: '야후 파이낸스',
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
]
