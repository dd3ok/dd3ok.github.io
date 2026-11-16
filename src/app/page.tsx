import PortfolioDashboard from '@/components/layout/PortfolioDashboard'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import PagesSection from '@/components/sections/PagesSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
      <main>
        <PortfolioDashboard
          chatSlot={<HeroSection />}
          aboutSlot={<AboutSection />}
          experienceSlot={<ExperienceSection />}
          projectsSlot={<ProjectsSection />}
          servicesSlot={<PagesSection />}
          contactSlot={<ContactSection />}
          footerSlot={<Footer />}
        />
      </main>
  )
}
