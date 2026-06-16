'use client'

import { useState } from 'react'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import ImageModal from '@/components/ui/ImageModal'
import ScrollAnimation from '@/components/animations/ScrollAnimations'
import { projects } from '@/data/portfolio'

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <ScrollAnimation
                        key={project.title}
                        animation="fade"
                        delay={index * 160}
                    >
                        <Card className="glass-card hover-lift h-full flex flex-col p-4">
                            <div
                                className="aspect-video bg-[var(--input-border)] border border-[var(--card-border)] rounded-xl overflow-hidden cursor-pointer relative group/image"
                                onClick={() => openImageModal(project.image, project.title)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        openImageModal(project.image, project.title)
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority={index < 2}
                                />

                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                    <div className="opacity-0 scale-75 group-hover/image:opacity-100 group-hover/image:scale-100 transition-all duration-500 bg-[var(--card-bg)] backdrop-blur-md rounded-full p-3 shadow-lg border border-[var(--card-border)] text-[var(--accent-color)]">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
                                    {project.title}
                                </h3>

                                <p className="text-[var(--text-secondary)] mb-5 leading-relaxed text-sm font-medium flex-1">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-[10px] font-bold bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/10 px-2.5 py-1 rounded-full shadow-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full font-bold rounded-xl transition-all duration-300 bg-[var(--accent-color)] hover:bg-[var(--accent-secondary)] text-white hover:scale-[1.02] shadow-md shadow-[var(--accent-color)]/10 hover:shadow-[var(--accent-color)]/20 px-4 py-2.5 text-xs inline-flex items-center justify-center tracking-wider uppercase"
                                    >
                                        방문하기
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </ScrollAnimation>
                ))}
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
