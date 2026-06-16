import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Card from '@/components/ui/Card'
import { aboutContent, skills } from '@/data/portfolio'

export default function AboutSection() {
    return (
        <section
            id="about"
            className="section-padding bg-transparent relative z-10"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--accent-color)] tracking-tight mb-4">
                        About Me
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
                        {aboutContent.summaryTags.map((tag) => `#${tag}`).join(' ')}
                    </p>
                </ScrollAnimation>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <ScrollAnimation animation="slideLeft">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            {aboutContent.title}
                        </h3>
                        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                            {aboutContent.paragraphs.map((paragraph) => (
                                <p key={paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slideRight">
                        <div className="grid grid-cols-2 gap-4">
                            {skills.map((skillGroup, index) => (
                                <ScrollAnimation
                                    key={skillGroup.category}
                                    animation="fade"
                                    delay={index * 120}
                                >
                                    <Card className="p-6 glass-card hover-lift">
                                        <h4 className="font-bold text-[var(--text-primary)] mb-3 text-base">
                                            {skillGroup.category}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skillGroup.items.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--card-bg)] hover:bg-[var(--accent-glow)] border border-[var(--card-border)] hover:border-[var(--card-hover-border)] hover:text-[var(--text-primary)] px-3 py-1 rounded-full transition-all duration-300"
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    )
}
