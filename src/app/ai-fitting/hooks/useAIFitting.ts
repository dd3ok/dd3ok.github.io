'use client'

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import Resizer from 'react-image-file-resizer'
import { getEnvConfig } from '@/utils/EnvConfig'

type FittingError = Error & {
    status?: number
}

interface UploadImageState {
    file: File | null
    previewUrl: string | null
}

const EMPTY_UPLOAD_IMAGE: UploadImageState = {
    file: null,
    previewUrl: null,
}

const revokeObjectUrl = (url: string | null) => {
    if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url)
    }
}

const resizeFile = (file: File): Promise<Blob> =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1024,
            1024,
            'JPEG',
            90,
            0,
            (blob) => resolve(blob as Blob),
            'blob'
        )
    })

const getErrorMessage = (status?: number) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return '오프라인 상태입니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요.'
    }

    if (status === 429) {
        return '1시간에 최대 10번 호출할 수 있어요.'
    }

    if (status && status >= 500) {
        return 'AI 피팅 서비스가 아직 준비 중일 수 있습니다. 잠시 후 다시 시도해주세요.'
    }

    return '이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

const updateUploadImageState = (
    setState: Dispatch<SetStateAction<UploadImageState>>,
    file: File
) => {
    setState({
        file,
        previewUrl: URL.createObjectURL(file),
    })
}

export function useAIFitting() {
    const config = getEnvConfig()
    const aiFittingApiBaseUrl = config.whoAmAiApi?.baseUrl

    const [personImage, setPersonImage] = useState<UploadImageState>(EMPTY_UPLOAD_IMAGE)
    const [clothingImage, setClothingImage] = useState<UploadImageState>(EMPTY_UPLOAD_IMAGE)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearGeneratedImage = useCallback(() => {
        setGeneratedImage(null)
    }, [])

    const resetTransientState = useCallback(() => {
        setError(null)
        clearGeneratedImage()
    }, [clearGeneratedImage])

    const handlePersonImageChange = useCallback((file: File) => {
        resetTransientState()
        updateUploadImageState(setPersonImage, file)
    }, [resetTransientState])

    const handleClothingImageChange = useCallback((file: File) => {
        resetTransientState()
        updateUploadImageState(setClothingImage, file)
    }, [resetTransientState])

    const handleGenerate = useCallback(async () => {
        if (!aiFittingApiBaseUrl) {
            setError('현재 환경에서는 AI 피팅 기능이 설정되어 있지 않습니다.')
            return
        }

        if (!personImage.file || !clothingImage.file) {
            setError('인물과 의류 사진을 모두 업로드해주세요.')
            return
        }

        setLoading(true)
        setError(null)
        clearGeneratedImage()

        try {
            const personImageBlob = await resizeFile(personImage.file)
            const clothingImageBlob = await resizeFile(clothingImage.file)

            const formData = new FormData()
            formData.append('personImage', personImageBlob, 'person.jpg')
            formData.append('clothingImage', clothingImageBlob, 'clothing.jpg')

            const response = await fetch(`${aiFittingApiBaseUrl}/api/ai-fitting`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const fittingError: FittingError = new Error(
                    response.statusText || '이미지 생성 요청에 실패했습니다.'
                )
                fittingError.status = response.status
                throw fittingError
            }

            const imageBlob = await response.blob()
            setGeneratedImage(URL.createObjectURL(imageBlob))
        } catch (err: unknown) {
            if (err instanceof Error && 'status' in err && typeof err.status === 'number') {
                setError(getErrorMessage(err.status))
            } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError(getErrorMessage())
            } else {
                setError('알 수 없는 오류가 발생했습니다.')
            }
        } finally {
            setLoading(false)
        }
    }, [aiFittingApiBaseUrl, clearGeneratedImage, clothingImage.file, personImage.file])

    useEffect(() => {
        return () => {
            revokeObjectUrl(personImage.previewUrl)
        }
    }, [personImage.previewUrl])

    useEffect(() => {
        return () => {
            revokeObjectUrl(clothingImage.previewUrl)
        }
    }, [clothingImage.previewUrl])

    useEffect(() => {
        return () => {
            revokeObjectUrl(generatedImage)
        }
    }, [generatedImage])

    return {
        aiFittingApiBaseUrl,
        canGenerate: Boolean(aiFittingApiBaseUrl && personImage.file && clothingImage.file) && !loading,
        clothingImageUrl: clothingImage.previewUrl,
        error,
        generatedImage,
        handleClothingImageChange,
        handleGenerate,
        handlePersonImageChange,
        isConfigured: Boolean(aiFittingApiBaseUrl),
        loading,
        personImageUrl: personImage.previewUrl,
    }
}
