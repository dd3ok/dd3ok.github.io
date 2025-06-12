// 경로: src/app/etfs/services/fallbackData.ts

import { ETF } from '../types/etf';

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
