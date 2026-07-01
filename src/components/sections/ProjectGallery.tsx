'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageModal from '@/components/ui/ImageModal'
import ScrollAnimation from '@/components/animations/ScrollAnimations'
import { projects } from '@/data/portfolio'
import type { Project } from '@/types'

const primaryProject = projects.find((project) => project.displayGroup === 'primary') ?? projects[0]
const relatedProjects = projects.filter((project) => project.displayGroup === 'related')
const supportingProjects = projects.filter((project) => project.displayGroup === 'supporting')

interface ProjectCardProps {
    project: Project
    index: number
    onImageOpen: (imageSrc: string, imageAlt: string) => void
    variant?: 'primary' | 'secondary'
}

function TechPills({ tech, compact = false }: { tech: string[]; compact?: boolean }) {
    return (
        <div className={`flex flex-wrap gap-2 ${compact ? '' : 'mb-6'}`}>
            {tech.map((item) => (
                <span
                    key={item}
                    className="rounded-full border border-[var(--accent-color)]/10 bg-[var(--accent-glow)] px-2.5 py-1 text-[10px] font-bold text-[var(--accent-color)] shadow-sm"
                >
                    {item}
                </span>
            ))}
        </div>
    )
}

function FeaturedProjectCard({ project, index, onImageOpen, variant = 'secondary' }: ProjectCardProps) {
    const isPrimary = variant === 'primary'

    return (
        <article className={`glass-card hover-lift overflow-hidden rounded-2xl p-4 ${isPrimary ? 'lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-5' : 'h-full sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4 lg:block'}`}>
            <div
                className={`group/image relative cursor-pointer overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--input-border)] ${isPrimary ? 'aspect-video lg:aspect-auto lg:min-h-[18rem]' : 'aspect-video sm:aspect-square lg:aspect-video'}`}
                onClick={() => onImageOpen(project.image, project.title)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onImageOpen(project.image, project.title)
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${project.title} 이미지 크게 보기`}
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={index === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                    className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                    priority={index === 0}
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover/image:bg-black/30">
                    <div className="scale-75 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-[var(--accent-color)] opacity-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover/image:scale-100 group-hover/image:opacity-100">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className={`flex flex-1 flex-col ${isPrimary ? 'p-4' : 'px-1 pt-4 sm:p-0 lg:p-4'}`}>
                <div className="mb-3 flex items-center gap-3">
                    {!isPrimary && (
                        <span className="rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-1 text-[11px] font-bold text-[var(--text-muted)]">
                            관련 작업
                        </span>
                    )}
                    <span className="text-xs font-bold text-[var(--accent-color)]">
                        {project.displayLabel}
                    </span>
                </div>

                <h3 className={`${isPrimary ? 'text-xl md:text-2xl' : 'text-lg'} mb-3 font-extrabold tracking-tight text-[var(--text-primary)]`}>
                    {project.title}
                </h3>

                <p className="mb-5 flex-1 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                    {project.description}
                </p>

                <TechPills tech={project.tech} />

                <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-4 py-2.5 text-xs font-bold text-[var(--button-primary-text)] shadow-md shadow-[var(--accent-color)]/10 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--button-primary-hover)] hover:shadow-[var(--accent-color)]/20"
                >
                    방문하기
                </a>
            </div>
        </article>
    )
}

function SupportingProjectCard({ project, isFirst }: { project: Project; isFirst: boolean }) {
    return (
        <article className={`grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_9rem] md:items-center ${isFirst ? 'pt-0' : 'border-t border-[var(--card-border)]'}`}>
            <div>
                <p className="mb-2 text-xs font-bold text-[var(--accent-color)]">
                    {project.displayLabel}
                </p>
                <h3 className="text-base font-extrabold leading-snug text-[var(--text-primary)]">
                    {project.title}
                </h3>

                <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                    {project.description}
                </p>

                <div className="mt-4">
                    <TechPills tech={project.tech.slice(0, 4)} compact />
                </div>
            </div>

            <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-4 text-sm font-bold text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--card-hover-border)] hover:text-[var(--accent-color)] md:w-full"
            >
                방문하기
                <span aria-hidden="true">→</span>
            </a>
        </article>
    )
}

export default function ProjectGallery() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageSrc: '',
        imageAlt: ''
    })

    const openImageModal = (imageSrc: string, imageAlt: string) => {
        setModalState({
            isOpen: true,
            imageSrc,
            imageAlt
        })
    }

    const closeImageModal = () => {
        setModalState({
            isOpen: false,
            imageSrc: '',
            imageAlt: ''
        })
    }

    return (
        <>
            <div className="space-y-8">
                <div className="grid gap-5">
                    <ScrollAnimation animation="fade">
                        <FeaturedProjectCard
                            project={primaryProject}
                            index={0}
                            onImageOpen={openImageModal}
                            variant="primary"
                        />
                    </ScrollAnimation>

                    <div className="grid gap-5 lg:grid-cols-2">
                        {relatedProjects.map((project, index) => (
                            <ScrollAnimation
                                key={project.title}
                                animation="fade"
                                delay={(index + 1) * 120}
                            >
                                <FeaturedProjectCard
                                    project={project}
                                    index={index + 1}
                                    onImageOpen={openImageModal}
                                />
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-5 md:p-6">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                                그 외 담당 범위
                            </h3>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                판매자센터 운영과 B2B 업무 시스템에서 맡았던 일을 범위별로 정리했습니다.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-[var(--text-muted)]">
                            {supportingProjects.length}개 작업
                        </span>
                    </div>

                    <div>
                        {supportingProjects.map((project, index) => (
                            <ScrollAnimation
                                key={project.title}
                                animation="fade"
                                delay={index * 90}
                            >
                                <SupportingProjectCard project={project} isFirst={index === 0} />
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </div>

            <ImageModal
                isOpen={modalState.isOpen}
                imageSrc={modalState.imageSrc}
                imageAlt={modalState.imageAlt}
                onClose={closeImageModal}
            />
        </>
    )
}
