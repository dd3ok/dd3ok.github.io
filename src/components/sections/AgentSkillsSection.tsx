import Link from 'next/link'
import { agentSkills } from '@/data/agentSkills'
import type { AgentSkill } from '@/types'

const categoryContent: Record<AgentSkill['category'], {
    title: string
    description: string
}> = {
    finance: {
        title: 'Finance API Skills',
        description: '시장 데이터와 금융 API 조회를 에이전트가 반복 없이 다루도록 정리했습니다.',
    },
    productivity: {
        title: 'Productivity Skills',
        description: '문서 요약, 세션 인수인계, 후속 확인처럼 반복되는 작업을 줄입니다.',
    },
}

const categoryOrder: AgentSkill['category'][] = ['finance', 'productivity']

const getSkillsForCategory = (category: AgentSkill['category']) => (
    agentSkills.filter((skill) => skill.category === category)
)

export default function AgentSkillsSection() {
    return (
        <section
            id="agent-skills"
            className="px-4 pb-16 pt-24 md:px-12 md:pb-20 md:pt-28"
            aria-labelledby="agent-skills-title"
        >
            <div className="container">
                <header className="border-b border-[var(--card-border)] pb-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <h1
                                id="agent-skills-title"
                                className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl"
                            >
                                Agent Skills
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                                Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 스킬 저장소입니다.
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-muted)]">
                            공개 스킬 {agentSkills.length}개
                        </p>
                    </div>
                </header>

                <div className="mt-8 space-y-10">
                    {categoryOrder.map((category) => {
                        const skills = getSkillsForCategory(category)
                        const content = categoryContent[category]

                        return (
                            <section key={category} aria-labelledby={`${category}-skills-title`}>
                                <div className="mb-4 border-b border-[var(--card-border)] pb-3">
                                    <h2
                                        id={`${category}-skills-title`}
                                        className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]"
                                    >
                                        {content.title}
                                    </h2>
                                    <p className="mt-1 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                                        {content.description}
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {skills.map((skill) => (
                                        <article key={skill.id} className="glass-card flex h-full flex-col p-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                                    {skill.title}
                                                </h3>
                                                <span className="rounded-full border border-[var(--card-border)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
                                                    {categoryContent[skill.category].title.replace(' Skills', '')}
                                                </span>
                                            </div>

                                            <p className="mt-3 flex-1 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                                                {skill.description}
                                            </p>

                                            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${skill.title} 기술`}>
                                                {skill.tech.map((tech) => (
                                                    <li
                                                        key={tech}
                                                        className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]"
                                                    >
                                                        {tech}
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link
                                                href={skill.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-5 inline-flex text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                                            >
                                                Repository
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
