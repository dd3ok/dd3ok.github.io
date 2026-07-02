export interface NoteCategory {
    id: string
    title: string
    description: string
    aliases?: string[]
}

export interface NoteCategoryMatch {
    category: string
}

export const noteCategories: NoteCategory[] = [
    {
        id: 'ai-tools',
        title: 'AI & Tools',
        description: 'AI 워크플로, 에이전트, 리서치 도구를 다룹니다.',
        aliases: ['ai', 'tools', 'ai-workflow', 'agent', 'agents'],
    },
    {
        id: 'tech',
        title: 'Tech',
        description: '개발, 인프라, 제품 구현 메모를 모읍니다.',
    },
    {
        id: 'business',
        title: 'Business',
        description: '시장, 사업 모델, 운영 관점의 리서치를 정리합니다.',
    },
    {
        id: 'finance',
        title: 'Finance',
        description: '투자, 금융 상품, 경제 흐름을 정리합니다.',
    },
    {
        id: 'learning',
        title: 'Learning',
        description: '학습 방법과 지식 정리 흐름을 다룹니다.',
    },
    {
        id: 'life',
        title: 'Life',
        description: '생활 의사결정과 실사용 리서치를 모읍니다.',
    },
    {
        id: 'health',
        title: 'Health',
        description: '건강, 운동, 장기 습관 리서치를 정리합니다.',
        aliases: ['health-longevity', 'longevity', 'exercise'],
    },
    {
        id: 'insights',
        title: 'Insights',
        description: '분류보다 생각의 전환이 중요한 메모를 모읍니다.',
        aliases: ['insight', 'research-notes', 'notes'],
    },
    {
        id: 'other',
        title: 'Other',
        description: '위 카테고리에 걸치지 않는 노트를 모읍니다.',
    },
]

export const allNotesCategory: NoteCategory = {
    id: 'all',
    title: '전체',
    description: '최신순으로 정리한 공개 노트입니다.',
}

export const noteFilterCategories: NoteCategory[] = [
    allNotesCategory,
    ...noteCategories,
]

export const getNotesForCategory = <TNote extends NoteCategoryMatch>(
    notes: TNote[],
    category: NoteCategory
) => {
    if (category.id === allNotesCategory.id) {
        return notes
    }

    return notes.filter((note) => note.category === category.id)
}

export const getNoteCategoryById = (id: string) => {
    return noteCategories.find((category) => category.id === id)
}

export const getStaticNoteCategorySlugs = () => {
    return noteCategories.map((category) => category.id)
}
