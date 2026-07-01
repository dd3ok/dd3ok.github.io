import type { AgentSkill } from '@/types'

export const agentSkills: AgentSkill[] = [
    {
        id: 'newbie-lens',
        title: 'Newbie Lens',
        description:
            'SOP, PRD, 런북, 티켓, 핸드오프 문서를 처음 보는 사람이나 가벼운 모델이 실행할 때 막히는 모호성을 찾아내는 스킬입니다. 숨은 전제, 누락된 입력, 검증 기준, 권한 경계를 점검합니다.',
        shortDescription: '문서 실행 모호성 점검 스킬',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/newbie-lens',
        keywords: [
            'document review',
            'ambiguity check',
            'SOP review',
            'PRD review',
            'agent skill',
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
        shortDescription: '워치리스트 관리 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/WATCHLIST.md',
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
            '코딩 에이전트가 압축, 리셋, 핸드오프 이후에도 현재 repo와 Git 상태를 검증하며 이어갈 수 있도록 .savepoint/SAVEPOINT.md를 만들거나 확인하는 스킬입니다.',
        shortDescription: 'repo/Git 체크포인트 스킬',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/savepoint',
        keywords: [
            'savepoint',
            'checkpoint',
            'context handoff',
            'coding agents',
            'agent skill',
        ],
    },
    {
        id: 'rabbit-hole',
        title: 'Rabbit Hole',
        description:
            '낯선 코드, 새 API, 논문 아이디어, 애매한 기능, 원인 분석처럼 바로 구현하기 어려운 작업에서 가장 작은 검증 산출물과 다음 결정을 만들도록 돕는 instruction-only 스킬입니다.',
        shortDescription: '기술 탐색 선행 스킬',
        tech: ['Markdown', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/rabbit-hole',
        keywords: [
            'technical exploration',
            'research spike',
            'debugging',
            'agent skill',
            'instruction-only',
        ],
    },
    {
        id: 'lucid',
        title: 'Lucid',
        description:
            '에이전트가 읽는 repo 컨텍스트를 대상으로 오래되었거나 과도하게 구체적인 지시, 충돌하는 규칙, 안전하지 않은 기억, prompt debt를 점검하고 정리 계획을 만드는 스킬입니다.',
        shortDescription: '컨텍스트 위생 점검 스킬',
        tech: ['Python', 'Codex', 'Claude Code'],
        github: 'https://github.com/dd3ok/lucid',
        keywords: [
            'context hygiene',
            'prompt debt',
            'agent context',
            'skill-first',
            'audit',
        ],
    },
    {
        id: 'naverstock-api-skill',
        title: 'NaverStock API Skill',
        description:
            '네이버증권(stock.naver.com) 비공식 읽기 전용 웹 API를 AI 에이전트가 안전하게 조회하도록 돕는 스킬입니다. 국내 주식 시세, 업종/테마/ETF, 뉴스, 리서치 데이터를 지원합니다.',
        shortDescription: '네이버증권 API 스킬',
        tech: ['Python', 'Codex', 'OpenAI'],
        github: 'https://github.com/dd3ok/naverstock-api-skill',
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
        keywords: [
            '토스증권 API',
            'TossInvest API',
            '주식 데이터',
            '재무제표',
            '스크리너',
        ],
    },
]
