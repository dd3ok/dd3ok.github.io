
import React from 'react';
import { Loader } from './Loader';

interface ResultDisplayProps {
  imageSrc: string | null;
  loading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  imageSrc,
  loading,
  error,
}) => {
  // 텍스트 응답인지 이미지 응답인지 확인
  const isTextResponse = imageSrc && !imageSrc.startsWith('data:image');
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">3. 가상 피팅 결과</h2>
      <div className="w-full flex-grow flex items-center justify-center border-2 border-slate-200 rounded-xl p-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-500 max-w-md">
            <p className="font-bold">오류 발생!</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : imageSrc ? (
          isTextResponse ? (
            // 텍스트 응답 처리
            <div className="text-center max-w-md">
              <p className="font-bold text-slate-700 mb-2">AI 응답</p>
              <div className="bg-slate-50 p-4 rounded-lg text-left">
                <p className="text-slate-700 whitespace-pre-wrap">{imageSrc}</p>
              </div>
            </div>
          ) : (
            // 이미지 응답 처리
            <img
              src={imageSrc}
              alt="생성된 이미지"
              className="object-contain w-full h-full max-h-[500px] rounded-lg"
            />
          )
        ) : (
          <p className="text-slate-500 text-center max-w-md">
            인물과 의류 사진을 업로드하고 버튼을 누르면 결과가 여기에 표시됩니다.
          </p>
        )}
      </div>
      
      {/* 결과 정보 */}
      {imageSrc && !isTextResponse && !loading && !error && (
        <div className="mt-4 text-center text-sm text-slate-500">
          <p>이미지를 오른쪽 클릭하여 저장할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};
