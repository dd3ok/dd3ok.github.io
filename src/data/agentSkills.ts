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
        id: 'spring-engineering-skills',
        title: 'Spring Engineering Skills',
        description:
            'Spring Boot 구현, 아키텍처·성능·보안 리뷰, 업그레이드 계획, Modulith 경계 감사를 8개 전문 워크플로로 분리한 Agent Skills 스위트입니다. 정적 근거 수집과 버전 호환성 검증을 분리해 다룹니다.',
        shortDescription: 'Spring 엔지니어링 스킬 모음',
        tech: ['Python', 'Spring Boot', 'Codex'],
        github: 'https://github.com/dd3ok/spring-engineering-skills',
        category: 'review',
        keywords: [
            'spring boot',
            'architecture review',
            'security',
            'modulith',
            'upgrade planner',
            '스프링 리뷰',
        ],
    },
    {
        id: 'boring-backend',
        title: 'Boring Backend',
        description:
            '신뢰성 있는 백엔드 API를 설계·구현·리뷰하기 위한 코딩 에이전트용 Agent Skill입니다. 정합성, 멱등성, 장애 경계와 검증 기준을 일관된 체크리스트로 다룹니다.',
        shortDescription: '백엔드 API 설계·리뷰',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/boring-backend',
        category: 'review',
        keywords: [
            'backend api',
            'reliability',
            'code review',
            'agent skill',
            '백엔드 설계',
        ],
    },
    {
        id: 'stash',
        title: 'Stash',
        description:
            '평소 컨텍스트에 올리지 않는 로컬 Agent Skills 라이브러리를 작업 설명이나 이름으로 검색해 필요한 SKILL.md만 불러오는 CLI 및 스킬입니다. 로컬 읽기 전용 카탈로그와 라이프사이클 관리를 분리합니다.',
        shortDescription: '로컬 스킬 검색·관리',
        tech: ['JavaScript', 'Node.js', 'Codex'],
        github: 'https://github.com/dd3ok/stash',
        category: 'workflow',
        keywords: [
            'stash',
            'skill library',
            'cli',
            'agent skill',
            '스킬 검색',
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
