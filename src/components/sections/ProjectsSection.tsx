import ScrollAnimation from '@/components/animations/ScrollAnimations'
import ProjectGallery from '@/components/sections/ProjectGallery'

export default function ProjectsSection() {
    return (
        <section
            id="projects"
            className="section-padding bg-white"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Projects
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        지마켓/옥션 판매자센터 ESM Plus와 삼성전자 BQMS의 MRO몰을 담당했습니다.
                    </p>
                </ScrollAnimation>

                <ProjectGallery />
            </div>
        </section>
    )
}
