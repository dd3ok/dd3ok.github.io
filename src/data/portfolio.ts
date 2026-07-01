import type { AboutContent, Experience, Project, Service, Skill } from '@/types'

export const aboutContent: AboutContent = {
    summaryTags: ['Spring', '분산시스템', 'AI에이전트', 'RAG', '자동화'],
    title: '백엔드 운영 경험을 바탕으로 AI 실험을 이어가고 있습니다',
    paragraphs: [
        'Spring 백엔드 개발과 운영을 해왔고, 최근에는 RAG, AI Agent, LLMOps, 자동화 파이프라인을 개인 프로젝트에서 검증하고 있습니다.',
        '지마켓 ESM+와 삼성전자 BQMS에서 로그인·인증, 판매자 API, 업무 시스템 운영을 맡았습니다. 안정성과 확장성을 우선해 일했습니다.',
        'who-am-ai, Repoclip, Agent Skill, 데이터 브리핑 파이프라인을 만들며 AI를 백엔드 흐름에 자연스럽게 붙이는 방법을 탐색하고 있습니다.',
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
            'Spring AI로 경력·프로젝트 데이터를 대화형으로 탐색하는 who-am-ai 커리어 Q&A 에이전트 개발',
            'Python 기반 주식 데이터 수집·분석·평가·브리핑 파이프라인 자동화',
            'RAG, Agent Tooling, LLM Eval, Observability를 개인 프로젝트에 적용하며 AI 백엔드 운영 패턴 검증',
            'Codex·Claude Code용 Agent Skill과 반복 개발 업무를 줄이는 자동화 워크플로우 설계·실험',
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
        title: 'ESM+ 로그인, 인증 개편 및 FDS 연동/개발',
        description: '로그인·인증 흐름을 개편하고, 같은 로그인 화면에 FDS 솔루션을 연동했습니다.',
        tech: ['Spring Boot', '.NET', 'MSSQL', 'Redis', 'Kafka', 'jQuery'],
        image: '/image/projects/esm-signin.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
        displayGroup: 'primary',
        displayLabel: '계정·인증',
    },
    {
        title: 'ESM+ 판매자 가입 개선',
        description: '신규 판매자 가입 시 지마켓/옥션 동시가입과 ESM 가입 프로세스를 개선했습니다.',
        tech: ['.NET', 'Spring Boot', 'Spring Batch', 'MSSQL'],
        image: '/image/projects/esm-signup.png',
        github: '#',
        demo: 'https://signup.esmplus.com/signup/seller',
        displayGroup: 'related',
        displayLabel: '계정·인증',
    },
    {
        title: 'ESM+ 슈퍼딜/올킬 신청 프로세스',
        description: '판매자가 슈퍼딜/올킬을 직접 신청하는 프로세스로, 프론트와 백엔드를 모두 담당했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Next.js', 'React'],
        image: '/image/projects/esm-seller-deal.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
        displayGroup: 'related',
        displayLabel: '신청 프로세스',
    },
    {
        title: 'ESM+ 카테고리 담당자 관리',
        description: 'ESM+ 카테고리와 영업 담당자를 매칭하고 관리하는 프로젝트로, 백엔드 전체와 어드민 프론트를 개발했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Spring Batch', 'Vue'],
        image: '/image/projects/esm-category-manager.png',
        github: '#',
        demo: 'https://signin.esmplus.com',
        displayGroup: 'supporting',
        displayLabel: '관리 화면',
    },
    {
        title: '판매자 관련 API, Gateway 담당 및 안정화',
        description: '판매자 정보, QA, 공지사항 등 판매자 관련 API와 Gateway 서버 안정화를 담당했습니다.',
        tech: ['Spring Boot', 'Spring Cloud', 'MSSQL', 'Redis', 'Kafka', 'Next.js', 'React'],
        image: '/image/projects/esm-etapi.png',
        github: '#',
        demo: 'https://etapi.gmarket.com/pages/API-%EA%B0%80%EC%9D%B4%EB%93%9C',
        displayGroup: 'supporting',
        displayLabel: 'API·Gateway',
    },
    {
        title: '삼성전자 입찰견적관리시스템(BQMS) MRO 몰',
        description: '삼성 임직원을 위한 B2B 서비스입니다. 결제를 제외한 상품 관리부터 정산까지 개발·운영했습니다.',
        tech: ['Spring', 'Oracle', 'Mybatis', 'jQuery', 'SOAP'],
        image: '/image/projects/sec-bqms.png',
        github: '#',
        demo: 'https://www.sec-bqms.com/bqms/partnerLogin/anonymous/loginPage.do?_frameF=true',
        displayGroup: 'supporting',
        displayLabel: 'B2B 업무',
    },
]

export const services: Service[] = [
    {
        id: 'waitworthy',
        title: 'Waitworthy',
        navLabel: 'Waitworthy',
        description: 'ChatGPT Deep Research, GPT Pro 워크플로, Gemini Deep Research 등 기다릴 가치가 있었던 AI 심층 리서치 보고서를 위키로 정리합니다.',
        path: '/notes',
        features: [
            '질문/답변을 Markdown 노트로 정리',
            '공개 가능한 글만 웹페이지에 노출',
            'GitHub 기반 버전관리와 자동화 확장'
        ],
        buttonText: '노트 보기',
        buttonType: 'service',
    },
    {
        id: 'whoamai',
        title: 'who-am-ai',
        navLabel: 'who-am-ai',
        description: '경력, 프로젝트, 기술 스택을 대화형으로 확인할 수 있는 포트폴리오 Q&A 에이전트',
        path: 'https://github.com/dd3ok/who-am-ai',
        features: ['Spring AI + Gemini 2.5 Flash Lite', '커리어 기반 맞춤 답변', '채팅 컨텍스트와 RAG 구현'],
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        id: 'repoclip',
        title: 'Repoclip',
        description: 'Repository를 LLM 컨텍스트로 정리하는 요약 도구',
        path: 'https://repoclip.onrender.com',
        features: ['GitHub 저장소 / ZIP 파일 업로드', '클립보드 또는 텍스트 파일로 export'],
        buttonText: '서비스 이용하기',
        buttonType: 'service',
    },
    {
        id: 'agent-skills',
        title: 'Open Source Agent Skills',
        navLabel: 'Agent Skills',
        description: '직접 만든 공개 Agent Skill repository를 목적별로 정리한 페이지',
        path: '/agent-skills/',
        features: ['공개 GitHub repository 기준으로 선별', '금융 데이터 API와 생산성 스킬 정리', 'Codex·Claude Code 활용 범위 기록'],
        buttonText: 'Skills 보기',
        buttonType: 'service',
    },
    {
        id: 'nopairprgm',
        title: '코드리뷰 AI',
        description: 'GitHub PR에 Gemini 기반 리뷰를 붙여본 코드리뷰 자동화',
        path: 'https://github.com/dd3ok/no-pair-prgm',
        features: ['Gemini 1.5 Flash 연동', 'GitHub API 연동', 'GitHub PR 자동 코드리뷰'],
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        id: 'oauth',
        title: 'OAuth 로그인 + 세션/토큰 관리',
        description: 'OAuth 로그인과 JWT/Redis 세션 관리를 구현한 인증 서비스 예제',
        path: 'https://github.com/dd3ok/auth-service',
        features: ['OAuth 2.0 로그인', 'JWT 토큰 인증', 'Redis 세션 관리'],
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
]
