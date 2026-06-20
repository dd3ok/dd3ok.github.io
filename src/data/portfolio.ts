import type { AboutContent, Experience, Project, Service, Skill } from '@/types'

export const aboutContent: AboutContent = {
    summaryTags: ['Spring', '분산시스템', 'AI에이전트', 'RAG', '자동화'],
    title: '운영 가능한 백엔드 위에 AI를 실험합니다',
    paragraphs: [
        'Spring 기반 백엔드 개발과 운영 경험을 바탕으로, 최근에는 RAG, AI Agent, LLMOps, 자동화 파이프라인을 개인 토이프로젝트에 적용해보고 있습니다.',
        '지마켓 ESM+와 삼성전자 BQMS에서 로그인·인증, 판매자 API, 업무 시스템 운영 경험을 쌓았고, 안정성과 확장성을 우선합니다.',
        'who-am-ai, Repoclip, Agent Skill, 데이터 브리핑 파이프라인 같은 실험을 통해 AI를 백엔드 시스템에 자연스럽게 녹이는 방법을 탐색하고 있습니다.',
    ],
}

export const skills: Skill[] = [
    { category: 'Language', items: ['Java', 'Kotlin', 'javascript', 'C#'] },
    { category: 'Framework & Library', items: ['Spring Boot', 'React', 'Next.js', 'Vue', 'jQuery'] },
    { category: 'Database', items: ['Oracle', 'MSSQL', 'Redis', 'MongoDB', 'Kafka'] },
    { category: 'AI Backend', items: ['Spring AI', 'RAG', 'Agent Tooling', 'LLM Eval', 'MCP'] },
    { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'] },
]

export const experiences: Experience[] = [
    {
        company: 'Current Focus',
        position: 'Backend / AI Agent Engineering',
        period: '2025.01 - Present',
        description: [
            'Spring AI 기반 커리어 Q&A 에이전트 who-am-ai 개발',
            'Python 기반 주식 데이터 수집·분석,평가,브리핑 자동화 파이프라인 개발',
            'RAG, Agent Tooling, Eval, Observability를 개인 토이프로젝트에 점진적으로 적용',
            'Codex, Claude Code 기반 Agent Skill과 개발 자동화 워크플로우 실험',
        ],
    },
    {
        company: '지마켓',
        position: 'Backend Developer',
        period: '2021.10 - 2024.12',
        description: [
            'ESM+ 로그인/가입/인증',
            'ESM+ 슈퍼딜/올킬 신청 및 관리',
            'ESM+ 카테고리-카테고리 담당자 매칭',
            'ESM+ QA/공지/판매자정보 관리/안정화',
            '판매자 관련 API 및 Gateway 관리/안정화',
        ],
    },
    {
        company: '미라콤아이앤씨',
        position: 'Backend Developer',
        period: '2018.01 - 2021.10',
        description: [
            '삼성전자 입찰견적시스템(BQMS) MRO몰 개발 및 운영',
            '삼성전자로지텍 설치지원시스템(BISS) 개발 및 운영',
        ],
    },
]

export const projects: Project[] = [
    {
        title: 'ESM+ 부정로그인탐지(ATO) 연동/개발',
        description: 'ATO 솔루션 도입을 위한 협의, 설계, 개발을 담당했습니다.',
        tech: ['.NET', 'Spring Boot', 'MSSQL', 'Redis', 'jQuery', 'Kafka'],
        image: '/image/projects/esm-signin.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
    },
    {
        title: 'ESM+ 판매자 가입 개선',
        description: '신규 판매자 가입시 지마켓/옥션 동시가입 및 ESM 가입프로세스 개선 작업입니다.',
        tech: ['.NET', 'Spring Boot', 'Spring Batch', 'MSSQL'],
        image: '/image/projects/esm-signup.png',
        github: '#',
        demo: 'https://signup.esmplus.com/signup/seller',
    },
    {
        title: 'ESM+ 로그인 및 인증 서비스 개발',
        description: '모놀리식 서비스였던 ESM+의 MSA화를 위해 로그인 서비스를 닷넷에서 스프링으로 마이그레이션했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Kafka'],
        image: '/image/projects/esm-signin.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
    },
    {
        title: 'ESM+ 슈퍼딜/올킬 신청 프로세스',
        description: '판매자가 슈퍼딜/올킬 직접 신청할 수 있는 프로세스이며 프론트와 백엔드 모두 담당했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Next.js', 'React'],
        image: '/image/projects/esm-seller-deal.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
    },
    {
        title: 'ESM+ 카테고리 담당자 관리',
        description: 'ESM+ 카테고리와 영업 담당자와 매칭 및 관리 프로젝트로 백엔드 전체와 어드민 프론트 개발을 했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Spring Batch', 'Vue'],
        image: '/image/projects/esm-category-manager.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
    },
    {
        title: '판매자 관련 API, Gateway 담당 및 안정화',
        description: '판매자 정보, QA, 공지사항 등 판매자 관련 API와 Gateway 서버 안정화를 담당했습니다.',
        tech: ['Spring Boot', 'Spring Cloud', 'MSSQL', 'Redis', 'Kafka', 'Next.js', 'React'],
        image: '/image/projects/esm-etapi.png',
        github: '#',
        demo: 'https://etapi.gmarket.com/pages/API-%EA%B0%80%EC%9D%B4%EB%93%9C',
    },
    {
        title: '삼성전자 입찰견적관리시스템(BQMS) MRO 몰',
        description: '삼성 임직원들을 위한 B2B 서비스로 결제를 제외한 상품부터 정산까지 개발/운영했습니다.',
        tech: ['Spring', 'Oracle', 'Mybatis', 'jQuery', 'SOAP'],
        image: '/image/projects/sec-bqms.png',
        github: '#',
        demo: 'https://www.sec-bqms.com/bqms/partnerLogin/anonymous/loginPage.do?_frameF=true',
    },
]

export const services: Service[] = [
    {
        id: 'waitworthy',
        title: 'Waitworthy',
        navLabel: 'Waitworthy',
        description: 'ChatGPT Deep Research, GPT Pro 워크플로, Gemini Deep Research 등 기다릴 가치가 있었던 AI 심층 리서치 보고서를 위키로 정리합니다.',
        icon: '🗂️',
        path: '/notes',
        features: [
            '질문/답변을 Markdown 노트로 정리',
            '공개 가능한 글만 웹페이지에 노출',
            'GitHub 기반 버전관리와 자동화 확장'
        ],
        color: 'from-emerald-500 to-cyan-500',
        buttonText: '노트 보기',
        buttonType: 'service',
    },
    {
        id: 'nopairprgm',
        title: '코드리뷰 AI',
        description: 'GitHub PR에 Gemini 기반 리뷰 흐름을 붙여본 코드리뷰 자동화 실험',
        icon: '🤖',
        path: 'https://github.com/dd3ok/no-pair-prgm',
        features: ['Gemini 1.5 Flash 연동', 'GitHub API 연동', 'GitHub PR 자동 코드리뷰'],
        color: 'from-purple-500 to-indigo-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        id: 'oauth',
        title: 'OAuth 로그인 + 세션/토큰 관리',
        description: 'OAuth 로그인과 JWT/Redis 세션 관리를 구현한 인증 서비스 예제',
        icon: '🔐',
        path: 'https://github.com/dd3ok/auth-service',
        features: ['OAuth 2.0 로그인', 'JWT 토큰 인증', 'Redis 세션 관리'],
        color: 'from-orange-500 to-red-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        id: 'whoamai',
        title: 'who-am-ai',
        navLabel: 'who-am-ai',
        description: '경력, 프로젝트, 기술 스택을 대화형으로 확인할 수 있는 포트폴리오 Q&A 에이전트',
        icon: '🤖',
        path: 'https://github.com/dd3ok/who-am-ai',
        features: ['Spring AI + Gemini 2.5 Flash Lite', '커리어 기반 맞춤 답변', '채팅 컨텍스트와 RAG 구현'],
        color: 'from-gray-300 to-gray-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        id: 'repoclip',
        title: 'Repoclip',
        description: 'Repository를 LLM 컨텍스트로 정리하는 요약 도구',
        icon: '📦',
        path: 'https://repoclip.onrender.com',
        features: ['GitHub 저장소 / ZIP 파일 업로드', '클립보드 or 텍스트파일로 export'],
        color: 'from-yellow-500 to-green-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service',
    },
]
