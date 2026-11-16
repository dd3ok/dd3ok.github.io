import DashboardSection from '@/components/layout/DashboardSection'
import ProjectGallery from '@/components/sections/ProjectGallery'
import { projects } from '@/data/portfolio'

export default function ProjectsSection() {
    return (
        <DashboardSection
            id="projects"
            eyebrow="Selected Works"
            title="Projects"
            description="로그인·가입, 판매자 API, 업무 시스템 운영 등 백엔드 중심 업무를 맡았습니다."
            headerExtra={
                <span className="inline-block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)]">
                    프로젝트 {projects.length}건
                </span>
            }
        >
            <ProjectGallery />
        </DashboardSection>
    )
}
