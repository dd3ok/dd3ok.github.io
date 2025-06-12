// 경로: src/app/etfs/services/fallbackData.ts

import { ETF } from '../types/etf';

// API 호출 실패 시 보여줄 한국 ETF 샘플 데이터
export function getKoreaETFFallbackData(): ETF[] {
    return [
        {
            code: '069500', name: 'KODEX 200 (샘플)', provider: '삼성자산운용', fee: 0.05,
            volume: 5000000, yield: 1.5, marketPrice: 35000, country: 'KR'
        },
        {
            code: '102110', name: 'TIGER 200 (샘플)', provider: '미래에셋자산운용', fee: 0.05,
            volume: 4500000, yield: 1.6, marketPrice: 35100, country: 'KR'
        },
        {
            code: '122630', name: 'KODEX 레버리지 (샘플)', provider: '삼성자산운용', fee: 0.64,
            volume: 80000000, yield: 3.2, marketPrice: 21000, country: 'KR'
        },
    ];
}

// 미국 ETF 정적 데이터
export function getUSETFData(): ETF[] {
    return [
        {
            code: 'SPY', name: 'SPDR S&P 500 ETF Trust', provider: 'State Street', fee: 0.09,
            volume: 60000000, yield: 1.3, marketPrice: 530.5, country: 'US'
        },
        {
            code: 'IVV', name: 'iShares CORE S&P 500', provider: 'BlackRock', fee: 0.03,
            volume: 4000000, yield: 1.35, marketPrice: 532.1, country: 'US'
        },
        {
            code: 'QQQ', name: 'Invesco QQQ Trust', provider: 'Invesco', fee: 0.20,
            volume: 45000000, yield: 0.6, marketPrice: 460.2, country: 'US'
        },
        {
            code: 'VOO', name: 'Vanguard S&P 500 ETF', provider: 'Vanguard', fee: 0.03,
            volume: 4200000, yield: 1.37, marketPrice: 488.9, country: 'US'
        },
    ];
}
