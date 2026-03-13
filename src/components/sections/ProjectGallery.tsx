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
                        <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                            <div
                                className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-6 overflow-hidden cursor-pointer relative group/image"
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
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority={index < 2}
                                />

                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {project.title}
                                </h3>

                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
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
                                        className="font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 px-4 py-2 text-sm inline-flex items-center justify-center"
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
