import DashboardSection from '@/components/layout/DashboardSection'
import ProjectGallery from '@/components/sections/ProjectGallery'

export default function ProjectsSection() {
    return (
        <DashboardSection
            id="projects"
            eyebrow="Selected Works"
            title="Projects"
            description="로그인·가입, 판매자 API, 업무 시스템 운영 등 백엔드 중심 업무를 맡았습니다."
        >
            <ProjectGallery />
        </DashboardSection>
    )
}
