import {ETF} from '../types/etf';
import {ApiResponse, ApiETFItem} from '../types/api';
import { getEnvConfig } from '@/utils/EnvConfig';

export default class FinanceApiService {
    private readonly config = getEnvConfig()
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor() {
        this.baseUrl = this.config.etfApi.baseUrl
        this.apiKey = this.config.etfApi.apiKey

        if (!this.apiKey) {
            console.warn('⚠️ ETF API 키가 설정되지 않았습니다. 폴백 데이터를 사용합니다.')
        }
    }

    private getLatestTradingDay(): string {
        const now = new Date();
        const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

        if (kst.getHours() < 16) {
            kst.setDate(kst.getDate() - 1);
        }

        // 최근 7일 이내에 영업일이 있을 거라 가정
        for (let i = 0; i < 7; i++) {
            const day = kst.getDay();
            if (day !== 0 && day !== 6) break;
            kst.setDate(kst.getDate() - 1);
        }

        const year = kst.getFullYear();
        const month = String(kst.getMonth() + 1).padStart(2, '0');
        const date = String(kst.getDate()).padStart(2, '0');
        const latest = `${year}${month}${date}`;
        console.log(`요청 기준일(basDt): ${latest}`);
        return latest;
    }


    private buildApiUrl(params: URLSearchParams): string {
        params.set('serviceKey', this.apiKey);
        params.set('resultType', 'json');
        return `${this.baseUrl}/getETFPriceInfo?${params.toString()}`;
    }

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
        try {
            const response = await fetch(proxyUrl, {method: 'GET'});
            if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
            const data: ApiResponse = await response.json();
            if (data.response.header.resultCode !== '00') {
                if (data.response.header.resultCode === '04') {
                    console.warn(`API 정보: ${data.response.header.resultMsg}`);
                    return {etfs: []};
                }
                throw new Error(`API 오류: ${data.response.header.resultMsg}`);
            }
            const items = data.response.body.items?.item;
            if (!items) return {etfs: []};
            const etfList = Array.isArray(items) ? items : [items];
            return {etfs: etfList.map(this.transformApiItemToETF)};
        } catch (error) {
            console.error('API 데이터 호출 중 심각한 오류 발생:', error);
            throw error;
        }
    }

    async getTopETFData(numOfRows: number): Promise<{ etfs: ETF[] }> {
        const params = new URLSearchParams({
            numOfRows: numOfRows.toString(),
            pageNo: '1',
            // endBasDt: this.getLatestTradingDay(),
            // BasDt: '20250613',
        });
        const targetUrl = this.buildApiUrl(params);
        return this.fetchData(targetUrl);
    }

    async searchETFByName(name: string): Promise<{ etfs: ETF[] }> {
        const params = new URLSearchParams({likeItmsNm: name, numOfRows: '100', basDt: this.getLatestTradingDay()});
        const targetUrl = this.buildApiUrl(params);
        return this.fetchData(targetUrl);
    }
}
