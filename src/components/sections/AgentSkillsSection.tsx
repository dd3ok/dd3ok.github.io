import Link from 'next/link'
import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Card from '@/components/ui/Card'
import { agentSkills } from '@/data/agentSkills'

const categoryConfig = {
    finance: {
        label: 'Finance API',
        color: 'bg-emerald-100 text-emerald-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
    },
    productivity: {
        label: 'Productivity',
        color: 'bg-blue-100 text-blue-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
} as const

export default function AgentSkillsSection() {
    const financeSkills = agentSkills.filter((s) => s.category === 'finance')
    const productivitySkills = agentSkills.filter((s) => s.category === 'productivity')

    return (
        <section
            id="agent-skills"
            className="section-padding bg-gradient-to-b from-gray-50 to-white"
            aria-label="Agent skill repositories"
        >
            <div className="container">
                {/* Finance API Skills */}
                <ScrollAnimation className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-emerald-600">{categoryConfig.finance.icon}</span>
                        Finance API Skills
                    </h2>
                </ScrollAnimation>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {financeSkills.map((skill, index) => (
                        <ScrollAnimation key={skill.id} animation="fade" delay={index * 100}>
                            <Card className="h-full flex flex-col">
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                            {skill.title}
                                        </h4>
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${categoryConfig[skill.category].color}`}
                                        >
                                            {categoryConfig[skill.category].label}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                        {skill.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {skill.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={skill.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Repository
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* Productivity Skills */}
                <ScrollAnimation className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-blue-600">{categoryConfig.productivity.icon}</span>
                        Productivity Skills
                    </h2>
                </ScrollAnimation>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productivitySkills.map((skill, index) => (
                        <ScrollAnimation key={skill.id} animation="fade" delay={index * 100}>
                            <Card className="h-full flex flex-col">
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-lg font-bold text-gray-900">
                                            {skill.title}
                                        </h4>
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${categoryConfig[skill.category].color}`}
                                        >
                                            {categoryConfig[skill.category].label}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                        {skill.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {skill.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={skill.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Repository
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
