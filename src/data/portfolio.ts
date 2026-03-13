import type { AboutContent, Experience, Project, Service, Skill } from '@/types'

export const aboutContent: AboutContent = {
    summaryTags: ['클린코드', '대용량트래픽', '분산환경', 'AI', 'LLM'],
    title: '확장 가능하고 안정적인 시스템을 만듭니다',
    paragraphs: [
        '스프링 기반의 백엔드 서비스를 주로 담당했고 최근에는 AI와 LLM에 관심이 있습니다. 웹 애플리케이션 개발과 운영에 전문성을 갖추고 있습니다.',
        '특히 분산 시스템 아키텍처에 관심이 많으며, 안정적인 시스템을 만들기 위해 노력합니다.',
        '지속적인 학습을 통해 최신 기술 트렌드를 따라가며, 팀과의 협업을 통한 문제 해결을 선호합니다.',
    ],
}

export const skills: Skill[] = [
    { category: 'Language', items: ['Java', 'Kotlin', 'javascript', 'C#'] },
    { category: 'Framework & Library', items: ['Spring Boot', 'React', 'Next.js', 'Vue', 'jQuery'] },
    { category: 'Database', items: ['Oracle', 'MSSQL', 'Redis', 'MongoDB', 'Kafka'] },
    { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'] },
]

export const experiences: Experience[] = [
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
        title: '모바일 청첩장(작업중)',
        description: '미리보는 모바일 청첩장',
        icon: '🤵‍♂️❤️👰‍♀️',
        path: '/wedding',
        features: ['모바일 청첩장', '포토 갤러리', '방명록'],
        color: 'from-pink-500 to-rose-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service',
    },
    {
        title: '코드리뷰 AI',
        description: 'PR을 올려 Gemini 한테 리뷰를 받자',
        icon: '🤖',
        path: 'https://github.com/dd3ok/no-pair-prgm',
        features: ['Gemini 1.5 Flash 연동', 'Github API 연동', 'Github PR 자동 코드리뷰'],
        color: 'from-purple-500 to-indigo-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        title: '마인크래프트 HUD',
        description: 'Minecraft Mod로 현재 내 상태를 표시합니다',
        icon: '⛏️',
        path: 'https://github.com/dd3ok/fabric-fpsxyzs',
        features: ['Fabric API 사용', '정보별 업데이트 주기 최적화'],
        color: 'from-green-500 to-emerald-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        title: 'OAuth 로그인 + 세션/토큰 관리',
        description: 'Naver, Kakao, Google OAuth로 간편하게 로그인하세요',
        icon: '🔐',
        path: 'https://github.com/dd3ok/auth-service',
        features: ['OAuth 2.0 로그인', 'JWT 토큰 인증', 'Redis 세션 관리'],
        color: 'from-orange-500 to-red-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        title: 'Who am AI',
        description: '저에 대해 궁금한 점을 직접 물어보세요.',
        icon: '🤖',
        path: 'https://github.com/dd3ok/who-am-ai',
        features: ['Spring AI + Gemini 2.5 Flash Lite', '이력서 맞춤 답변', '채팅 컨텍스트, RAG 구현'],
        color: 'from-gray-300 to-gray-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo',
    },
    {
        title: 'Repoclip',
        description: 'LLM을 위한 Repository 요약 도구',
        icon: '📦',
        path: 'https://repoclip.onrender.com',
        features: ['Github 저장소 / ZIP 파일 업로드', '클립보드 or 텍스트파일로 export'],
        color: 'from-yellow-500 to-green-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service',
    },
    {
        title: '입어보기+',
        description: '잘 어울릴까? 편하게 입어보세요.',
        icon: '👕',
        path: 'https://dd3ok.github.io/ai-fitting',
        features: ['AI 피팅 서비스', 'gemini-2.5-flash-image-preview'],
        color: 'from-blue-500 to-cyan-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service',
    },
]
