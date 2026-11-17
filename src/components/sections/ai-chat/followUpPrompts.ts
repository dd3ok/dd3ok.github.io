import type { ChatMessage } from './chatProtocol'

export const STARTER_PROMPTS = [
    '유인재님은 어떤 개발자인지 간단히 소개해 주세요',
    '유인재님의 주요 경력과 회사별 이력을 알려주세요',
    '지마켓에서 어떤 백엔드 작업을 했어?',
    '최근 공개한 GitHub 프로젝트들을 소개해 주세요',
    '퇴사 이후 최근에는 어떤 프로젝트와 공부를 하고 있나요?',
    '보유한 주요 기술 스택과 자격증을 알려주세요',
] as const

interface PromptRule {
    id: string
    pattern: RegExp
    prompts: readonly string[]
}

const ANSWER_FOLLOW_UP_RULES: readonly PromptRule[] = [
    {
        id: 'not-found',
        pattern: /(확인 가능한 경력 자료|찾지 못했습니다)/,
        prompts: [
            '유인재님의 주요 경력과 회사별 이력을 알려주세요',
            '공개된 개인 GitHub 프로젝트들을 알려주세요',
            '보유한 주요 기술 스택이 궁금해요',
            '퇴사 이후 최근 진행한 프로젝트들을 소개해 주세요',
            '총 경력 기간과 학력·자격증 정보를 알려주세요',
        ],
    },
    {
        id: 'who-am-ai',
        pattern: /(who-am-ai|spring ai|atlas vector|rag|gemini|문맥 유지|익명 세션)/i,
        prompts: [
            'who-am-ai에서 RAG 검색 정확도는 어떻게 높였나요?',
            'Gemini 폴백이나 레이트 리밋은 어떻게 처리하나요?',
            '짧은 후속 질문의 문맥은 어떻게 유지하나요?',
            'who-am-ai의 세션 보안과 요청 제한 구조가 궁금해요',
            '로컬 회귀 검증과 실제 Gemini 평가는 어떻게 분리했나요?',
            'who-am-ai의 관측 지표는 어떤 도구로 수집하나요?',
        ],
    },
    {
        id: 'cloudflare-sync',
        pattern: /(cloudflare-mobile-sync|workers|better auth|nonce|credential manager|증분 동기화)/i,
        prompts: [
            'cloudflare-mobile-sync-starter에서 해결하려는 문제와 기여를 알려주세요',
            'Android Credential Manager와 Better Auth 세션 흐름이 궁금해요',
            'cloudflare-mobile-sync-starter의 저장소 구성과 문서화를 설명해 주세요',
            'commerce-saga 분산 트랜잭션 프로젝트도 소개해 주세요',
        ],
    },
    {
        id: 'commerce-saga',
        pattern: /(commerce-saga|orchestration saga|debezium|outbox|보상 트랜잭션|orchestrator)/i,
        prompts: [
            'commerce-saga에서 해결한 문제와 서비스 구성을 알려주세요',
            'commerce-saga의 Kafka와 Debezium Connect 구성이 궁금해요',
            'auth-service 인증 서버 프로젝트도 알려주세요',
        ],
    },
    {
        id: 'auth-service',
        pattern: /(auth-service|oauth|jwt|hexagonal|소셜 로그인)/i,
        prompts: [
            'auth-service에서 구현한 핵심 기능과 아키텍처를 알려주세요',
            'auth-service에서 사용한 기술 스택과 Redis 역할이 궁금해요',
            '지마켓 ESM 로그인 개편 프로젝트도 설명해 주세요',
        ],
    },
    {
        id: 'spring-skills',
        pattern: /(spring-engineering-skills|boring-backend|modulith|위협 모델링)/i,
        prompts: [
            'spring-engineering-skills에서 해결한 문제와 구성을 알려주세요',
            'boring-backend 프로젝트는 어떤 목적의 도구인가요?',
            'stash와 briefprint 프로젝트도 소개해 주세요',
        ],
    },
    {
        id: 'agent-skills',
        pattern: /(watchlist|savepoint|lucid|stash|briefprint|agent skill|에이전트 개발 도구)/i,
        prompts: [
            'savepoint는 어떤 문제와 기능을 다루는 프로젝트인가요?',
            'lucid가 점검하는 대상과 기본 동작 방식을 알려주세요',
            'WATCHLIST.md는 어떤 방식으로 후속 확인을 관리하나요?',
            'stash 프로젝트의 검색·라이프사이클 기능을 설명해 주세요',
            'briefprint의 문서 지문 캐싱 기능을 알려주세요',
        ],
    },
    {
        id: 'market-skills',
        pattern: /(naverstock|tossinvest|binance|주식 데이터|시장 데이터|testnet)/i,
        prompts: [
            'naverstock-api-skill의 기능과 안전 경계를 알려주세요',
            'tossinvest-api-skill은 어떤 데이터를 조회하는 도구인가요?',
            'binance-api-skill에서 다루는 범위와 Testnet 가이드를 설명해 주세요',
            '퇴사 이후 진행한 Python 파이프라인 작업도 소개해 주세요',
        ],
    },
    {
        id: 'dev-tools',
        pattern: /(repoclip|no-pair-prgm|webhook|코드리뷰)/i,
        prompts: [
            'repoclip의 주요 기능과 WebSocket 세션 관리 방식을 알려주세요',
            'no-pair-prgm의 Webhook 기반 코드리뷰 구성을 설명해 주세요',
            '개인 프로젝트 목록을 전체적으로 알려주세요',
        ],
    },
    {
        id: 'gmarket',
        pattern: /(지마켓|g마켓|esm|셀러딜|슈퍼딜|올킬|카테고리|ato|판매자 가입|geoip)/i,
        prompts: [
            'ESM 로그인 개편에서 Spring Boot 마이그레이션과 성능 개선 내용을 알려주세요',
            '지마켓 슈퍼딜 신청 프로젝트에서 해결한 문제와 기여를 설명해 주세요',
            'ESM 카테고리 담당자 관리에서 Redis 캐싱을 어떻게 활용했나요?',
            'ESM+ 부정 로그인 탐지(ATO) 도입 프로젝트 내용을 알려주세요',
            '판매자 가입 개선과 옥션 올킬 신청 프로젝트도 설명해 주세요',
        ],
    },
    {
        id: 'miracom',
        pattern: /(미라콤|bqms|biss|삼성전자|로지텍|mro)/i,
        prompts: [
            '삼성전자 BQMS MRO 몰에서 담당한 개선 작업을 알려주세요',
            '삼성전자로지텍 BISS 개편 프로젝트 내용을 설명해 주세요',
            '이후 지마켓에서는 어떤 프로젝트를 진행했나요?',
        ],
    },
    {
        id: 'profile-stack',
        pattern: /(기술 스택|총 경력|학력|자격증|퇴사 이후|최근 활동)/i,
        prompts: [
            '퇴사 이후 최근에는 어떤 프로젝트와 공부를 하고 있나요?',
            '총 경력 기간과 회사별 근무 이력을 정리해 주세요',
            '보유한 기술 스택과 자격증 정보를 알려주세요',
            '학력 정보를 알려주세요',
        ],
    },
]

const CROSS_TOPIC_EXPLORATION_PROMPTS = [
    'Cloudflare Mobile Sync Starter는 어떤 프로젝트인가요?',
    'commerce-saga 분산 트랜잭션 프로젝트를 설명해 주세요',
    'spring-engineering-skills는 어떤 프로젝트인가요?',
    '지마켓에서 진행한 주요 프로젝트들을 소개해 주세요',
    'naverstock-api-skill과 tossinvest-api-skill 프로젝트를 알려주세요',
    '삼성전자 BQMS와 BISS 개발·운영 경험을 알려주세요',
    'savepoint와 lucid 프로젝트를 각각 설명해 주세요',
    'auth-service 인증 서버 프로젝트를 소개해 주세요',
    '퇴사 이후 최근에는 어떤 공부를 하고 있나요?',
] as const

function hashString(value: string): number {
    let hash = 2166136261
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index)
        hash = Math.imul(hash, 16777619)
    }
    return hash >>> 0
}

function pickRotated(pool: readonly string[], seed: number, excluded: ReadonlySet<string>, limit: number): string[] {
    const available = pool.filter((item) => !excluded.has(item.trim().toLowerCase()))
    if (available.length <= limit) {
        return [...available]
    }

    const start = seed % available.length
    const step = available.length > limit + 1 ? 2 : 1
    const picked: string[] = []
    let cursor = start

    while (picked.length < limit && picked.length < available.length) {
        const candidate = available[cursor % available.length]
        if (!picked.includes(candidate)) {
            picked.push(candidate)
        }
        cursor += step
    }

    return picked
}

export function buildAnswerFollowUpPrompts(messages: readonly ChatMessage[]): string[] {
    if (messages.length <= 1) {
        return []
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.isUser || lastMessage.status !== 'complete') {
        return []
    }

    const excluded = new Set(
        messages
            .filter((msg) => msg.isUser)
            .map((msg) => msg.text.trim().toLowerCase())
    )

    const answerText = lastMessage.text
    const matchedRules = ANSWER_FOLLOW_UP_RULES.filter((rule) => rule.pattern.test(answerText))
    const matchedPool = matchedRules.flatMap((rule) => rule.prompts)
    const uniqueMatchedPool = [...new Set(matchedPool)]

    const seed = hashString(`${lastMessage.id}:${messages.length}:${answerText.length}`)
    const selected = pickRotated(uniqueMatchedPool, seed, excluded, 2)

    for (const item of selected) {
        excluded.add(item.trim().toLowerCase())
    }

    const remainingSlots = 3 - selected.length
    if (remainingSlots > 0) {
        const lateralPool = matchedRules.length > 0
            ? CROSS_TOPIC_EXPLORATION_PROMPTS
            : [...CROSS_TOPIC_EXPLORATION_PROMPTS, ...ANSWER_FOLLOW_UP_RULES.flatMap((rule) => rule.prompts)]
        selected.push(...pickRotated(lateralPool, seed + 7, excluded, remainingSlots))
    }

    return selected.slice(0, 3)
}
