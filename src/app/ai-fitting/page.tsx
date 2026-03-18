'use client'

import { Header } from './components/Header'
import { ImageUploader } from './components/ImageUploader'
import { ResultDisplay } from './components/ResultDisplay'
import { useAIFitting } from './hooks/useAIFitting'
import StatusBanner from '@/components/ui/StatusBanner'

const uploadGuides = [
    {
        id: 'person-uploader',
        title: '1. 인물 사진',
        guide: '단독 사진, 배경과 구분이 명확한 사진이 좋아요.',
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
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
            <Header />

            <main className="container mx-auto max-w-4xl px-1 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
                <p className="mx-auto mb-2 max-w-2xl text-center text-sm text-slate-600 md:text-base">
                    인물 사진과 의류 사진을 업로드하여 가상으로 옷을 입어보세요.
                </p>
                <p className="mx-auto mb-4 max-w-2xl text-center text-xs text-slate-500 sm:mb-6">
                    * 이미지는 저장되지 않습니다.
                </p>

                {!isConfigured && (
                    <StatusBanner
                        tone="warning"
                        title="현재 환경에서는 AI 피팅 API가 연결되어 있지 않습니다."
                        description="배포 환경 또는 환경변수가 연결된 로컬 환경에서 업로드와 결과 생성을 사용할 수 있습니다."
                        className="mx-auto mb-6 max-w-2xl"
                    />
                )}

                <div className="mx-auto mb-6 max-w-3xl">
                    <div className="flex flex-col gap-8 px-2 sm:px-0 lg:flex-row">
                        {uploadItems.map((item) => (
                            <div key={item.id} className="w-full lg:w-1/2">
                                <ImageUploader
                                    id={item.id}
                                    title={item.title}
                                    imageSrc={item.imageSrc}
                                    onImageChange={item.onImageChange}
                                />
                                <div className="mt-3 w-full sm:mt-4">
                                    <div className="mx-1 rounded-lg bg-slate-50 px-2 py-2 text-center text-xs text-slate-600 sm:mx-0 sm:px-4 sm:py-3 sm:text-sm">
                                        <span className="block font-medium">{item.guide}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 mt-6 flex justify-center sm:mb-12 sm:mt-16 md:mb-8 md:mt-24">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className="mx-4 w-full max-w-xs rounded-full bg-sky-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:text-base"
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

            <footer className="mt-12 w-full border-t border-slate-200">
                <div className="container mx-auto flex items-center justify-between p-4 text-xs text-slate-500 md:text-sm">
                    <span>© {currentYear} dd3ok. All rights reserved.</span>
                    <span>Powered by Gemini</span>
                </div>
            </footer>
        </div>
    )
}
