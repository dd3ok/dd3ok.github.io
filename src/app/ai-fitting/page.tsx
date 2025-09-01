'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';

const AIFittingPage: React.FC = () => {
    // 1. 상태 선언 (생략)
    const [personImageFile, setPersonImageFile] = useState<File | null>(null);
    const [personImageUrl, setPersonImageUrl] = useState<string | null>(null);
    const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
    const [clothingImageUrl, setClothingImageUrl] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 2. 이미지 리사이징 함수 (생략)
    const resizeFile = (file: File): Promise<Blob> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 1024, 1024, "JPEG", 90, 0,
                (blob) => { resolve(blob as Blob); },
                "blob"
            );
        });

    // 3. 각 이미지에 대한 핸들러를 명확하게 분리 (생략)
    const handlePersonImageChange = (file: File) => {
        setPersonImageFile(file);
        setPersonImageUrl(prevUrl => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(file);
        });
    };

    const handleClothingImageChange = (file: File) => {
        setClothingImageFile(file);
        setClothingImageUrl(prevUrl => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(file);
        });
    };

    // 4. AI 피팅 생성 핸들러 (생략)
    const handleGenerate = useCallback(async () => {
        if (!personImageFile || !clothingImageFile) {
            setError('인물과 의류 사진을 모두 업로드해주세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const personImageBlob = await resizeFile(personImageFile);
            const clothingImageBlob = await resizeFile(clothingImageFile);

            const formData = new FormData();
            formData.append('personImage', personImageBlob, 'person.jpg');
            formData.append('clothingImage', clothingImageBlob, 'clothing.jpg');

            const apiUrl = process.env.NEXT_PUBLIC_WHO_AM_AI_API + '/api/ai-fitting';
            const response = await fetch(apiUrl, { method: 'POST', body: formData });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('1시간에 최대 10번 호출할 수 있어요.');
                }

                const errorBody = await response.text();
                throw new Error(`이미지 생성에 실패했습니다: ${errorBody || response.statusText}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedImage(imageUrl);
        } catch (err: any) {
            // 네트워크 에러 등 다른 에러들에 대한 처리
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
            } else {
                setError(err.message || '알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, [personImageFile, clothingImageFile]);


    // 5. 컴포넌트 언마운트 시 URL 정리 (생략)
    useEffect(() => {
        return () => {
            if (personImageUrl) URL.revokeObjectURL(personImageUrl);
            if (clothingImageUrl) URL.revokeObjectURL(clothingImageUrl);
            if (generatedImage) URL.revokeObjectURL(generatedImage);
        };
    }, [personImageUrl, clothingImageUrl, generatedImage]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
            <Header />

            {/* 메인 컨테이너 */}
            <main className="container mx-auto px-1 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 max-w-4xl">
                <p className="text-center text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                    인물 사진과 의류 사진을 업로드하여 가상으로 옷을 입어보세요.
                </p>

                {/* 에러 메시지 (생략) */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 max-w-2xl mx-auto">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <span className="font-medium">오류:</span> {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ------------------- ▼▼▼ 여기부터 수정 ▼▼▼ ------------------- */}
                {/* 이미지 업로드 섹션 */}
                <div className="max-w-3xl mx-auto mb-6">
                    {/* 부모 컨테이너를 flexbox로 변경하고 간격을 조정합니다. */}
                    <div className="flex flex-col lg:flex-row gap-8 px-2 sm:px-0">
                        {/* 각 자식 요소에 데스크탑 너비를 지정합니다. */}
                        <div className="w-full lg:w-1/2">
                            <ImageUploader
                                id="person-uploader"
                                title="1. 인물 사진"
                                imageSrc={personImageUrl}
                                onImageChange={handlePersonImageChange}
                            />
                            <div className="w-full mt-3 sm:mt-4">
                                <div className="mx-1 sm:mx-0 text-center text-xs sm:text-sm text-slate-600 bg-slate-50 py-2 px-2 sm:py-3 sm:px-4 rounded-lg">
                                    <span className="font-medium block">단독 사진, 배경과 구분이 명확한 사진이 좋아요.</span>
                                </div>
                            </div>
                        </div>

                        {/* 각 자식 요소에 데스크탑 너비를 지정합니다. */}
                        <div className="w-full lg:w-1/2">
                            <ImageUploader
                                id="clothing-uploader"
                                title="2. 의류 사진"
                                imageSrc={clothingImageUrl}
                                onImageChange={handleClothingImageChange}
                            />
                            <div className="w-full mt-3 sm:mt-4">
                                <div className="mx-1 sm:mx-0 text-center text-xs sm:text-sm text-slate-600 bg-slate-50 py-2 px-2 sm:py-3 sm:px-4 rounded-lg">
                                    <span className="block">배경과 구분이 뚜렷하거나 누끼 제거 후 사용해주세요.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6 mb-6 sm:mt-16 sm:mb-12 md:mt-24 md:mb-8">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !personImageFile || !clothingImageFile}
                        className="bg-sky-600 text-white font-bold py-3 px-8 rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base w-full max-w-xs mx-4"
                    >
                        {loading ? '생성 중...' : '입어보기'}
                    </button>
                </div>

                {/* 결과 섹션 (생략) */}
                <div className="max-w-2xl mx-auto">
                    <ResultDisplay
                        imageSrc={generatedImage}
                        loading={loading}
                        error={error}
                    />
                </div>
            </main>

            <footer className="w-full border-t border-slate-200 mt-12">
                <div className="container mx-auto flex justify-between items-center p-4 text-slate-500 text-xs md:text-sm">
        <span>
            © 2025 dd3ok. All rights reserved.
        </span>
                    <span>
            Powered by Gemini
        </span>
                </div>
            </footer>
        </div>
    );
};

export default AIFittingPage;