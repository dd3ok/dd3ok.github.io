'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';

const AIFittingPage: React.FC = () => {
    // 1. 상태 선언 (이전과 동일)
    const [personImageFile, setPersonImageFile] = useState<File | null>(null);
    const [personImageUrl, setPersonImageUrl] = useState<string | null>(null);
    const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
    const [clothingImageUrl, setClothingImageUrl] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 2. 이미지 리사이징 함수 (이전과 동일)
    const resizeFile = (file: File): Promise<Blob> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 1024, 1024, "JPEG", 90, 0,
                (blob) => { resolve(blob as Blob); },
                "blob"
            );
        });

    // 3. 각 이미지에 대한 핸들러를 명확하게 분리
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

    // 4. AI 피팅 생성 핸들러 (이전과 거의 동일)
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
                const errorBody = await response.text();
                throw new Error(`이미지 생성에 실패했습니다: ${errorBody || response.statusText}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedImage(imageUrl);
        } catch (err: any) {
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [personImageFile, clothingImageFile]);

    // 5. 컴포넌트 언마운트 시 URL 정리 (이전과 동일)
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
            <main className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-3xl">
                <p className="text-center text-slate-600 mb-8 max-w-xl mx-auto">
                    인물 사진과 의류 사진을 업로드하여 가상으로 옷을 입혀보세요.
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 max-w-xl mx-auto">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {/* Error Icon */}
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

                {/* 6. ImageUploader에 명확하게 분리된 핸들러 전달 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 mb-12">
                    <div>
                        <ImageUploader
                            id="person-uploader"
                            title="1. 인물 사진"
                            imageSrc={personImageUrl}
                            onImageChange={handlePersonImageChange}
                        />
                        <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg break-words text-center">
                            <p className="font-medium">* 단독 사진, 배경과 구분이 명확한 사진이 좋아요.</p>
                        </div>
                    </div>
                    <div>
                        <ImageUploader
                            id="clothing-uploader"
                            title="2. 의류 사진"
                            imageSrc={clothingImageUrl}
                            onImageChange={handleClothingImageChange}
                        />
                        <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg break-words text-center">
                            <p>* 배경과 구분이 뚜렷하거나 누끼 제거 후 사용해주세요.</p>
                        </div>
                    </div>
                </div>

                {/* 가상 피팅 시작하기 버튼 섹션 - 위치를 아래로 이동하고 너비 조정 */}
                <div className="flex justify-center my-10">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !personImageFile || !clothingImageFile}
                        className="bg-sky-600 text-white font-bold py-3 px-6 rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg w-full max-w-[280px] md:max-w-xs"
                    >
                        {loading ? '생성 중...' : '가상 피팅 시작하기'}
                    </button>
                </div>

                {/* 수정된 부분: 결과 섹션을 별도로 분리하고 상단 여백 추가 */}
                <div className="mt-10 pt-6">
                    <ResultDisplay
                        imageSrc={generatedImage}
                        loading={loading}
                        error={error}
                    />
                </div>
            </main>
            <footer className="text-center p-4 text-slate-500 text-sm">
                <p>Powered by Gemini API & WHO-AM-AI</p>
            </footer>
        </div>
    );
};

export default AIFittingPage;
