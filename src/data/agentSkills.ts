import type { AgentSkill } from '@/types'

export const agentSkills: AgentSkill[] = [
    {
        id: 'briefprint',
        title: 'Briefprint',
        description:
            '반복 문서 브리핑을 위한 명시 호출형 Agent Skill입니다. 문서를 재사용 가능한 구조화 브리핑으로 바꾸고 문서 지문 기반 캐시에 저장한 뒤, 같은 내용을 LLM에 다시 읽히지 않고 brief, digest, executive, action_items 형식으로 재렌더링합니다.',
        shortDescription: '캐시형 문서 브리핑',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/briefprint',
        category: 'workflow',
        keywords: [
            'briefprint',
            'document briefing',
            'fingerprint cache',
            'rerendering',
            'agent skill',
            '문서 브리핑',
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
        id: 'market-data-skills',
        title: 'Market Data Skills',
        description:
            '네이버증권, 토스증권, Yahoo Finance, Binance, Upbit 시장 데이터 Agent Skill을 한곳에서 찾도록 정리한 카탈로그입니다. 각 provider skill은 개별 저장소를 유지하면서 필요한 것만 설치할 수 있습니다.',
        shortDescription: '시장 데이터 스킬 모음',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/market-data-skills',
        category: 'finance',
        keywords: [
            'market data',
            '네이버증권 API',
            'TossInvest API',
            'Yahoo Finance',
            'Binance API',
            'Upbit API',
        ],
    },
]
