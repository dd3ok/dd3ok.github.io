'use client'

import Navigation from '@/components/layout/Navigation'
import { ImageUploader } from './components/ImageUploader'
import { ResultDisplay } from './components/ResultDisplay'
import { useAIFitting } from './hooks/useAIFitting'
import StatusBanner from '@/components/ui/StatusBanner'

const uploadGuides = [
    {
        id: 'person-uploader',
        title: '1. 인물 사진',
        guide: '단독 사진, 배경과 구분이 명확한 사진이 좋습니다.',
        field: 'person' as const,
    },
    {
        id: 'clothing-uploader',
        title: '2. 의류 사진',
        guide: '배경과 구분이 뚜렷하거나 누끼 제거 후 사용해주세요.',
        field: 'clothing' as const,
    },
]

export default function AIFittingPage() {
    const currentYear = new Date().getFullYear()
    const {
        canGenerate,
        clothingImageUrl,
        error,
        generatedImage,
        handleClothingImageChange,
        handleGenerate,
        handlePersonImageChange,
        isConfigured,
        loading,
        personImageUrl,
    } = useAIFitting()

    const uploadItems = uploadGuides.map((item) => ({
        ...item,
        imageSrc: item.field === 'person' ? personImageUrl : clothingImageUrl,
        onImageChange: item.field === 'person' ? handlePersonImageChange : handleClothingImageChange,
    }))

    return (
        <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans relative overflow-hidden pb-12">
            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--orb-color-1)] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[var(--orb-color-2)] rounded-full blur-[120px] pointer-events-none z-0" />

            <Navigation />

            <main className="container mx-auto max-w-4xl px-4 py-8 pt-24 relative z-10">
                <div className="text-center mb-10 pt-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gradient mb-3">
                        👕 입어보기+
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-md mx-auto font-medium">
                        인물 사진과 의류 사진을 업로드하여 AI 가상 피팅을 체험해보세요.
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">
                        * 업로드하신 이미지는 서버에 절대 저장되지 않으며 즉시 삭제됩니다.
                    </p>
                </div>

                {!isConfigured && (
                    <StatusBanner
                        tone="warning"
                        title="현재 환경에서는 AI 피팅 API가 연결되어 있지 않습니다."
                        description="배포 환경 또는 환경변수가 연결된 로컬 환경에서 업로드와 결과 생성을 사용할 수 있습니다."
                        className="mx-auto mb-8 max-w-2xl border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)]"
                    />
                )}

                <div className="mx-auto mb-8 max-w-3xl">
                    <div className="flex flex-col gap-8 px-2 sm:px-0 lg:flex-row">
                        {uploadItems.map((item) => (
                            <div key={item.id} className="w-full lg:w-1/2 flex flex-col">
                                <div className="flex-1">
                                    <ImageUploader
                                        id={item.id}
                                        title={item.title}
                                        imageSrc={item.imageSrc}
                                        onImageChange={item.onImageChange}
                                    />
                                </div>
                                <div className="mt-3.5 w-full">
                                    <div className="mx-1 rounded-xl glass-card px-4 py-3 text-center text-xs text-[var(--text-secondary)] font-semibold sm:mx-0">
                                        <span>{item.guide}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8 mt-10 flex justify-center sm:mb-12 sm:mt-16 md:mb-10 md:mt-20">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!canGenerate || loading}
                        className="mx-4 w-full max-w-xs rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-secondary)] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 hover:shadow-[0_0_15px_var(--accent-glow)] md:text-base"
                    >
                        {loading ? '생성 중...' : '입어보기'}
                    </button>
                </div>

                <div className="mx-auto max-w-2xl">
                    <ResultDisplay
                        imageSrc={generatedImage}
                        loading={loading}
                        error={error}
                    />
                </div>
            </main>

            <footer className="mt-20 w-full border-t border-[var(--card-border)] bg-[var(--nav-bg)] backdrop-blur-xl">
                <div className="container mx-auto flex items-center justify-between p-6 text-xs text-[var(--text-secondary)] font-semibold md:text-sm">
                    <span>© {currentYear} dd3ok. All rights reserved.</span>
                    <span className="text-[var(--text-muted)] font-bold">Powered by Gemini</span>
                </div>
            </footer>
        </div>
    )
}
