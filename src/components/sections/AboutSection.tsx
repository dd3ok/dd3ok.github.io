import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Card from '@/components/ui/Card'
import { aboutContent, skills } from '@/data/portfolio'

export default function AboutSection() {
    return (
        <section
            id="about"
            className="section-padding bg-white"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        About Me
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {aboutContent.summaryTags.map((tag) => `#${tag}`).join(' ')}
                    </p>
                </ScrollAnimation>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <ScrollAnimation animation="slideLeft">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {aboutContent.title}
                        </h3>
                        <div className="space-y-4 text-gray-600">
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
                                    <Card className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            {skillGroup.category}
                                        </h4>
                                        <div className="space-y-2">
                                            {skillGroup.items.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block mr-2 mb-1"
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
