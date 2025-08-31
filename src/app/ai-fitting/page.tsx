
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';

const AIFittingPage: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSizeWarning, setImageSizeWarning] = useState<string | null>(null);

  // 이미지 크기 검증
  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 이미지 크기 제한 (예: 1024x1024 이하 권장)
        if (img.width > 1024 || img.height > 1024) {
          setImageSizeWarning(`이미지 크기가 ${img.width}x${img.height}입니다. 1024x1024 이하의 이미지를 사용하면 더 나은 결과를 얻을 수 있습니다.`);
        } else {
          setImageSizeWarning(null);
        }
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => async (file: File) => {
    try {
      // 이미지 크기 검증
      const isValid = await validateImageSize(file);
      if (!isValid) {
        setError('지원되지 않는 이미지 형식입니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.onerror = () => {
        setError('이미지를 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('인물과 의류 사진을 모두 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setImageSizeWarning(null);

    try {
      const resultImage = await generateStyledImage(personImage, clothingImage);
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : '이미지 생성 중 알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, [personImage, clothingImage]);

  // 컴포넌트 언마운트 시 이미지 URL 정리
  useEffect(() => {
    return () => {
      if (personImage?.startsWith('blob:')) {
        URL.revokeObjectURL(personImage);
      }
      if (clothingImage?.startsWith('blob:')) {
        URL.revokeObjectURL(clothingImage);
      }
      if (generatedImage?.startsWith('blob:')) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [personImage, clothingImage, generatedImage]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
          인물 사진과 의류 사진을 업로드하여 가상으로 옷을 입혀보세요. AI가 자연스럽게 두 이미지를 합성하여 새로운 스타일을 제안합니다.
        </p>

        {/* 이미지 크기 경고 */}
        {imageSizeWarning && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">경고:</span> {imageSizeWarning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 오류 메시지 */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageUploader
            id="person-uploader"
            title="1. 인물 사진"
            imageSrc={personImage}
            onImageChange={handleImageChange(setPersonImage)}
          />
          <ImageUploader
            id="clothing-uploader"
            title="2. 의류 사진"
            imageSrc={clothingImage}
            onImageChange={handleImageChange(setClothingImage)}
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={loading || !personImage || !clothingImage}
            className="bg-sky-600 text-white font-bold py-3 px-12 rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {loading ? '생성 중...' : '가상 피팅 시작하기'}
          </button>
        </div>

        <ResultDisplay
          imageSrc={generatedImage}
          loading={loading}
          error={error}
        />
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default AIFittingPage;
