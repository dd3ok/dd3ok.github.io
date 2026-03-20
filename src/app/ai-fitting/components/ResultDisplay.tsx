/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Loader } from './Loader'
import StatusBanner from '@/components/ui/StatusBanner'

interface ResultDisplayProps {
    imageSrc: string | null
    loading: boolean
    error: string | null
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    imageSrc,
    loading,
    error,
}) => {
    const isImage = imageSrc && (imageSrc.startsWith('blob:') || imageSrc.startsWith('data:image'))

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-4 text-center">3. 입어보기 결과</h2>
            <div className="w-full flex-grow flex items-center justify-center border-2 border-slate-200 rounded-xl p-2 md:p-4">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="w-full max-w-md">
                        <StatusBanner
                            tone="error"
                            title="이미지 생성 중 오류가 발생했습니다."
                            description={error}
                        />
                    </div>
                ) : imageSrc ? (
                    isImage ? (
                        <img
                            src={imageSrc}
                            alt="생성된 이미지"
                            className="object-contain w-full h-full max-h-[300px] md:max-h-[500px] rounded-lg"
                        />
                    ) : (
                        <div className="text-center max-w-xs md:max-w-md">
                            <p className="font-bold text-slate-700 mb-2">AI 응답</p>
                            <div className="bg-slate-50 p-3 md:p-4 rounded-lg text-left">
                                <p className="text-slate-700 whitespace-pre-wrap text-sm md:text-base">{imageSrc}</p>
                            </div>
                        </div>
                    )
                ) : (
                    <p className="text-slate-500 text-center max-w-xs md:max-w-md text-sm md:text-base">
                        인물과 의류 사진을 업로드하고 버튼을 누르면 결과가 여기에 표시됩니다.
                    </p>
                )}
            </div>

            {isImage && !loading && !error && (
                <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-slate-500">
                    <p>이미지를 오른쪽 클릭하여 저장할 수 있습니다.</p>
                </div>
            )}
        </div>
    )
}
