import ScrollAnimation from '@/components/animations/ScrollAnimations'
import ProjectGallery from '@/components/sections/ProjectGallery'

export default function ProjectsSection() {
    return (
        <section
            id="projects"
            className="section-padding bg-transparent relative z-10"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--accent-color)] tracking-tight mb-4">
                        Projects
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
                        로그인·가입, 판매자 API, 업무 시스템 운영을 대표 사례와 보조 작업으로 나눠 정리했습니다.
                    </p>
                </ScrollAnimation>

                <ProjectGallery />
            </div>
        </section>
    )
}
