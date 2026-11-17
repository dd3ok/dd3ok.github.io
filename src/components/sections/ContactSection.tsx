import DashboardSection from '@/components/layout/DashboardSection'
import ContactForm from '@/components/sections/ContactForm'

export default function ContactSection() {
    return (
        <DashboardSection
            id="contact"
            eyebrow="Direct Message"
            title="Contact"
            description="새로운 기회나 협업이 있다면 편하게 연락해 주세요"
            headerExtra={
                <span className="inline-block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--text-secondary)]">
                    hwick@kakao.com
                </span>
            }
        >
            <article className="glass-card rounded-2xl p-5 md:p-6">
                <ContactForm />
            </article>
        </DashboardSection>
    )
}
