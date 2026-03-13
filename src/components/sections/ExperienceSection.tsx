import ScrollAnimation from '@/components/animations/ScrollAnimations'
import { experiences } from '@/data/portfolio'

export default function ExperienceSection() {
    return (
        <section
            id="experience"
            className="section-padding bg-gray-50"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Experience
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        다양한 환경에서 개발을 경험했습니다.
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
                                <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
                            )}

                            {/* 타임라인 도트 - 정확한 중앙 정렬 */}
                            <div className="absolute left-3 top-8 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />

                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {exp.position}
                                        </h3>
                                        <p className="text-blue-600 font-medium">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500 mt-1 md:mt-0">
                    {exp.period}
                  </span>
                                </div>

                                {/* 불릿 포인트와 텍스트 정렬 개선 */}
                                <ul className="space-y-3">
                                    {exp.description.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 flex items-start leading-relaxed">
                                            <span className="text-blue-600 mr-2 mt-1 flex-shrink-0 text-sm">•</span>
                                            <span className="flex-1">{item}</span>
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
