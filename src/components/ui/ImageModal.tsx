'use client'

import { useEffect } from 'react'

interface ImageModalProps {
    isOpen: boolean
    imageSrc: string
    imageAlt: string
    onClose: () => void
}

export default function ImageModal({ isOpen, imageSrc, imageAlt, onClose }: ImageModalProps) {
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-xl shadow-2xl max-w-5xl max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* 닫기 버튼 */}
                <button
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-lg"
                    onClick={onClose}
                    aria-label="모달 닫기"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* 이미지 */}
                <div className="flex items-center justify-center bg-gray-100">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="max-w-full max-h-[80vh] object-contain"
                        onError={e => {
                            e.currentTarget.src = '/api/placeholder/600/400'
                        }}
                    />
                </div>

                {/* 이미지 제목 */}
                <div className="p-6 bg-white border-t">
                    <h3 className="text-lg font-semibold text-gray-900 text-center">
                        {imageAlt}
                    </h3>
                </div>
            </div>
        </div>
    )
}
