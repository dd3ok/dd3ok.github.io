import { GoogleGenAI, Part } from "@google/genai";

export async function POST(request: Request) {
    try {
        const { personImageBase64, clothingImageBase64 } = await request.json();

        const API_KEY = process.env.GEMINI_API_KEY;

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

        const clothingSource = base64ToPart(clothingImageBase64);
        const targetPerson = base64ToPart(personImageBase64);

        const prompt = '목표는 왼쪽 의류 사진의 옷을 오른쪽 인물사진에게 입히는 것입니다.' +
            '왼쪽 의류 사진에 인물이 포함되면 해당 인물이 입은 옷을 추출해주세요.' +
            '왼쪽 의류 사진에 상의, 하의 둘다 있다면 둘다 추출해 주세요.' +
            '오른쪽 인물사진의 기존 옷은 왼쪽 의류 사진에서 추출된 옷으로 자연스럽게 대체 시켜주세요.';

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
            return new Response(JSON.stringify({ result: imageDataUrls[0] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
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
            return new Response(JSON.stringify({ message: "네트워크 연결 문제가 발생했습니다. 인터넷 연결을 확인해주세요." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (error instanceof Error && /API[_-]?KEY|GEMINI/i.test(error.message)) {
            return new Response(JSON.stringify({ message: "API 키가 유효하지 않습니다. 관리자에게 문의해주세요." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: `이미지 생성에 실패했습니다: ${error.message}` }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ message: "알 수 없는 오류로 이미지 생성에 실패했습니다." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}