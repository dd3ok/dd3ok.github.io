export const generateStyledImage = async (
    personImageBase64: string,
    clothingImageBase64: string
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personImageBase64,
                clothingImageBase64,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("이미지 생성 요청 중 오류 발생:", error);
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("네트워크 연결 문제가 발생했습니다. 인터넷 연결을 확인해주세요.");
        }
        if (error instanceof Error) {
            throw new Error(`이미지 생성에 실패했습니다: ${error.message}`);
        }
        throw new Error("알 수 없는 오류로 이미지 생성에 실패했습니다.");
    }
};