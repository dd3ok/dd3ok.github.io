import Navigation from '@/components/layout/Navigation'
import { HealthcheckInitializer } from '@/components/HealthcheckInitializer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import PagesSection from '@/components/sections/PagesSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
      <main className="page-enter">
        <HealthcheckInitializer />
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <PagesSection />
        <ContactSection />
        <Footer />
      </main>
  )
}
