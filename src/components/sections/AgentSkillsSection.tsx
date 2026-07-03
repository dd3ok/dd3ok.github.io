import { agentSkills } from '@/data/agentSkills'

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
                                Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 Agent Skill 저장소입니다.
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-muted)]">
                            공개 스킬 {agentSkills.length}개
                        </p>
                    </div>
                </header>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {agentSkills.map((skill) => (
                        <article key={skill.id} className="glass-card flex h-full flex-col p-5">
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                {skill.title}
                            </h2>

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

                            <a
                                href={skill.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                            >
                                Repository
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
