import ScrollAnimation from '@/components/animations/ScrollAnimations'
import { experiences } from '@/data/portfolio'

export default function ExperienceSection() {
    return (
        <section
            id="experience"
            className="section-padding bg-transparent relative z-10"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--accent-color)] tracking-tight mb-4">
                        Experience
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
                        인증, 판매자센터, B2B 업무 시스템을 중심으로 백엔드를 만들고 운영했습니다.
                    </p>
                </ScrollAnimation>

                <div className="max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <ScrollAnimation
                            key={exp.company}
                            animation="slideLeft"
                            delay={index * 180}
                            className="relative pl-12 pb-12"
                        >
                            {/* 타임라인 선 */}
                            {index !== experiences.length - 1 && (
                                <div className="absolute left-5 top-12 w-0.5 h-full bg-[var(--card-border)]" />
                            )}

                            {/* 타임라인 도트 */}
                            <div className="absolute left-3 top-8 w-4 h-4 bg-[var(--accent-color)] rounded-full border-4 border-[var(--bg-color)] ring-4 ring-[var(--accent-glow)] shadow-md" />

                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                            {exp.position}
                                        </h3>
                                        <p className="text-[var(--accent-color)] font-semibold mt-0.5">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded-full mt-1.5 md:mt-0 shadow-sm">
                                        {exp.period}
                                    </span>
                                </div>

                                <ul className="space-y-3">
                                    {exp.description.map((item, idx) => (
                                        <li key={idx} className="text-[var(--text-secondary)] flex items-start leading-relaxed text-sm">
                                            <span className="text-[var(--accent-color)] mr-2 mt-1.5 flex-shrink-0 text-[10px]">•</span>
                                            <span className="flex-1 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
