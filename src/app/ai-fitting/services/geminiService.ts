import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function base64ToPart(dataUrl: string): Part {
    const parts = dataUrl.split(';base64,');
    if (parts.length !== 2) {
        throw new Error("유효하지 않은 Base64 데이터 URL입니다.");
    }
    const mimeType = parts[0].split(':')[1];
    const base64Data = parts[1];
    return {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };
}

export const generateStyledImage = async (
    personImageBase64: string,
    clothingImageBase64: string
): Promise<string> => {
    try {
        const clothingSource = base64ToPart(clothingImageBase64);
        const targetPerson = base64ToPart(personImageBase64);

        // const prompt =`
        // 1. 첫번째 이미지는 [추출이 필요한 의류] 또는 [추출이 필요한 의류를 착용한 인물] 사진이야.\n
        // 2. 첫번째 이미지에 인물이 포함되면 [해당 인물이 입은 옷만 정확히 분리해서 추출]해.\n
        // 3. 두번째 이미지는 [최종 착용자] 사진이야.\n
        // 4. 착용자의 포즈, 체형, 얼굴은 그대로 유지하고, 첫번째 이미지에서 [추출한 의류를 자연스럽게 입혀 사진을 생성]해.\n
        // 4. 필요 시 4:5 또는 3:4 비율로 정렬해.`;

        const prompt = '목표는 왼쪽 의류 사진의 옷을 오른쪽 인물사진에게 입히는 것입니다.' +
            '왼쪽 의류 사진에 인물이 포함되면 해당 인물이 입은 옷을 추출해주세요.' +
            '왼쪽 의류 사진에 상의, 하의 둘다 있다면 둘다 추출해 주세요.' +
            '오른쪽 인물사진의 기존 옷은 왼쪽 의류 사진에서 추출된 옷으로 자연스럽게 대체 시켜주세요.';

        // const prompt = `Place the clothing from the [clothingSource] onto the person in the [targetPerson]. Make it a natural fit, and replace the person's original clothing with the new items.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: [clothingSource, targetPerson, { text: prompt }],
            config: {
                systemInstruction: "결과물은 text가 아닌 image만 생성함",
            }
        });

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("API로부터 유효한 응답을 받지 못했습니다.");
        }

        const candidate = response.candidates[0];

        if (candidate.finishReason === "SAFETY") {
            throw new Error("생성된 콘텐츠가 안전 정책에 위반되어 표시할 수 없습니다.");
        }

        const imageDataUrls: string[] = [];
        const parts = candidate.content?.parts ?? [];

        for (const p of parts) {
            if ("inlineData" in p && p.inlineData?.data && p.inlineData?.mimeType) {
                imageDataUrls.push(`data:${p.inlineData.mimeType};base64,${p.inlineData.data}`);
            }
        }

        if (imageDataUrls.length > 0) {
            return imageDataUrls[0];
        }

        const textParts: string[] = [];
        for (const p of parts) {
            if ("text" in p && typeof p.text === "string" && p.text.trim().length > 0) {
                textParts.push(p.text);
            }
        }
        if (textParts.length > 0) {
            console.warn("이미지 대신 텍스트 응답이 반환되었습니다:", textParts.join("\n\n"));
            throw new Error(
                "이미지가 생성되지 않았습니다. 프롬프트나 입력 이미지를 확인해주세요."
            );
        }

        throw new Error("API로부터 유효한 이미지 응답을 받지 못했습니다.");

    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("네트워크 연결 문제가 발생했습니다. 인터넷 연결을 확인해주세요.");
        }
        if (error instanceof Error && /API[_-]?KEY|GEMINI/i.test(error.message)) {
            throw new Error("API 키가 유효하지 않습니다. 관리자에게 문의해주세요.");
        }
        if (error instanceof Error) {
            throw new Error(`이미지 생성에 실패했습니다: ${error.message}`);
        }
        throw new Error("알 수 없는 오류로 이미지 생성에 실패했습니다.");
    }
};