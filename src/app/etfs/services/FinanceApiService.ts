// 경로: src/app/etfs/services/FinanceApiService.ts

import { ETF } from '../types/etf';
import { ApiResponse, ApiETFItem } from '../types/api';

export default class FinanceApiService {
    private readonly baseUrl = 'https://apis.data.go.kr/1160100/service/GetSecuritiesProductInfoService';
    private readonly apiKey: string;
    constructor(apiKey: string) { if (!apiKey) throw new Error('API 키가 제공되지 않았습니다.'); this.apiKey = apiKey; }
    private getLatestTradingDay(): string { const today = new Date(); const kstOffset = 9 * 60 * 60 * 1000; const kstToday = new Date(today.getTime() + kstOffset); if (kstToday.getUTCHours() < 16) { kstToday.setUTCDate(kstToday.getUTCDate() - 1); } if (kstToday.getUTCDay() === 0) { kstToday.setUTCDate(kstToday.getUTCDate() - 2); } else if (kstToday.getUTCDay() === 6) { kstToday.setUTCDate(kstToday.getUTCDate() - 1); } const year = kstToday.getUTCFullYear(); const month = String(kstToday.getUTCMonth() + 1).padStart(2, '0'); const day = String(kstToday.getUTCDate()).padStart(2, '0'); const latestDate = `${year}${month}${day}`; console.log(`요청 기준일(basDt): ${latestDate}`); return latestDate; }
    private buildApiUrl(params: URLSearchParams): string { params.set('serviceKey', this.apiKey); params.set('resultType', 'json'); return `${this.baseUrl}/getETFPriceInfo?${params.toString()}`; }

    private transformApiItemToETF(item: ApiETFItem): ETF {
        const marketPrice = parseFloat(item.clpr) || 0;
        const volume = parseFloat(item.trqu) || 0;
        return {
            name: item.itmsNm, code: item.srtnCd, marketPrice, volume,
            yield: parseFloat(item.fltRt) || 0, marketCap: parseFloat(item.mrktTotAmt) || 0,
            nav: parseFloat(item.nav) || 0, baseIndex: item.bssIdxIdxNm,
            highPrice: parseFloat(item.hipr) || 0, lowPrice: parseFloat(item.lopr) || 0,
            tradingValue: marketPrice * volume, // 추정 거래대금 계산
            fee: 0.1, provider: '정보없음', country: 'KR', sector: '기타'
        };
    }

    private async fetchData(url: string): Promise<{ etfs: ETF[] }> {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        try { const response = await fetch(proxyUrl, { method: 'GET' }); if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`); const data: ApiResponse = await response.json(); if (data.response.header.resultCode !== '00') { if (data.response.header.resultCode === '04') { console.warn(`API 정보: ${data.response.header.resultMsg}`); return { etfs: [] }; } throw new Error(`API 오류: ${data.response.header.resultMsg}`); } const items = data.response.body.items?.item; if (!items) return { etfs: [] }; const etfList = Array.isArray(items) ? items : [items]; return { etfs: etfList.map(this.transformApiItemToETF) }; }
        catch (error) { console.error('API 데이터 호출 중 심각한 오류 발생:', error); throw error; }
    }
    async getTopETFData(numOfRows: number): Promise<{ etfs: ETF[] }> { const params = new URLSearchParams({ numOfRows: numOfRows.toString(), pageNo: '1', basDt: this.getLatestTradingDay() }); const targetUrl = this.buildApiUrl(params); return this.fetchData(targetUrl); }
    async searchETFByName(name: string): Promise<{ etfs: ETF[] }> { const params = new URLSearchParams({ likeItmsNm: name, numOfRows: '100', basDt: this.getLatestTradingDay() }); const targetUrl = this.buildApiUrl(params); return this.fetchData(targetUrl); }
}
