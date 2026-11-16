import DashboardSection from '@/components/layout/DashboardSection'
import { agentSkills } from '@/data/agentSkills'

export default function AgentSkillsSection() {
    return (
        <DashboardSection
            id="agent-skills"
            eyebrow="Open Source · AI Workflow"
            headingTag="h1"
            headingId="agent-skills-title"
            title="Agent Skills"
            description="Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 Agent Skill 저장소입니다."
            headerExtra={
                <span className="inline-block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)]">
                    공개 스킬 {agentSkills.length}개
                </span>
            }
        >
            <div className="grid gap-4 md:grid-cols-2">
                {agentSkills.map((skill, index) => (
                    <article
                        key={skill.id}
                        className="glass-card flex h-full min-w-0 flex-col justify-between rounded-2xl p-5 [overflow-wrap:anywhere] md:p-6"
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold tabular-nums text-[var(--text-muted)]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text-muted)]">
                                    Skill Repo
                                </span>
                            </div>

                            <h2 className="mt-3 text-lg font-extrabold text-[var(--text-primary)]">
                                {skill.title}
                            </h2>

                            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                {skill.description}
                            </p>

                            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${skill.title} 기술`}>
                                {skill.tech.map((tech) => (
                                    <li
                                        key={tech}
                                        className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]"
                                    >
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-5 border-t border-[var(--card-border)] pt-4">
                            <a
                                href={skill.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                            >
                                <span>Repository</span>
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </DashboardSection>
    )
}
