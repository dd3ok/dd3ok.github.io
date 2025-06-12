// 경로: src/app/etfs/types/etf.ts

export interface ETF {
    name: string;
    code: string;
    marketPrice: number;
    yield: number;
    volume: number;
    fee: number;
    provider: string;
    country: 'KR' | 'US';
    marketCap: number;
    nav: number;
    baseIndex: string;
    highPrice: number;
    lowPrice: number;
    sector: string;
    tradingValue: number;
}

export interface ETFFilters {
    country: 'KR' | 'US' | 'ALL';
    searchTerm: string;
    hideLowVolume: boolean;
}

export interface ETFSortOptions {
    field: keyof ETF;
    direction: 'asc' | 'desc';
}
