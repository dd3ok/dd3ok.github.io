import { useState, useEffect, useCallback, useMemo } from 'react';
import FinanceApiService from '../services/FinanceApiService';
import { ETF, ETFFilters, ETFSortOptions } from '../types/etf';
import { getUSETFData } from '../services/fallbackData';
const INITIAL_FETCH_COUNT = 1200; const CACHE_DURATION = 60 * 1000;
interface CachedData { timestamp: number; data: ETF[]; }
interface EtfDetails { [code: string]: { provider: string; fee: number; sector: string; }; }
interface UseETFDataProps { apiKey: string; }
interface UseETFDataReturn {
    filteredData: ETF[]; loading: boolean; error: string | null; lastUpdated: Date | null; isLiveData: boolean; koreaCount: number; usCount: number;
    highestDailyChangeETF: ETF | null; highestVolumeETF: ETF | null;
    refetch: () => Promise<void>; setFilters: React.Dispatch<React.SetStateAction<ETFFilters>>; setSortOptions: React.Dispatch<React.SetStateAction<ETFSortOptions>>;
    filters: ETFFilters; sortOptions: ETFSortOptions;
}
export function useETFData({ apiKey }: UseETFDataProps): UseETFDataReturn {
    const [allEtfData, setAllEtfData] = useState<ETF[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isLiveData, setIsLiveData] = useState<boolean>(false);
    const [filters, setFilters] = useState<ETFFilters>({ country: 'KR', searchTerm: '', hideLowVolume: true });
    const [sortOptions, setSortOptions] = useState<ETFSortOptions>({ field: 'tradingValue', direction: 'desc' });
    const apiService = useMemo(() => new FinanceApiService(apiKey), [apiKey]);
    const fetchETFData = useCallback(async () => {
        const cacheKey = 'topEtfDataCache'; const cached = sessionStorage.getItem(cacheKey);
        if (cached) { const { timestamp, data }: CachedData = JSON.parse(cached); if (Date.now() - timestamp < CACHE_DURATION) { console.log('✅ 캐시된 데이터 사용'); setAllEtfData(data); setIsLiveData(true); setLoading(false); setLastUpdated(new Date(timestamp)); return; } }
        setLoading(true); console.log(`🚀 전체 ETF 데이터 수집 시작...`);
        try {
            const [detailsResponse, { etfs: koreaETFs }] = await Promise.all([ fetch('/data/etf-details.json'), apiService.getTopETFData(INITIAL_FETCH_COUNT) ]);
            const etfDetails: EtfDetails = await detailsResponse.json();
            const mergedKoreaETFs = koreaETFs.map(etf => ({ ...etf, provider: etfDetails[etf.code]?.provider || etf.provider, fee: etfDetails[etf.code]?.fee || etf.fee, sector: etfDetails[etf.code]?.sector || '기타' }));
            const uniqueKoreaETFs = [...new Map(mergedKoreaETFs.map(etf => [etf.code, etf])).values()];
            const usETFs = getUSETFData(); const combinedData = [...uniqueKoreaETFs, ...usETFs];
            setAllEtfData(combinedData);
            const cacheData: CachedData = { timestamp: Date.now(), data: combinedData }; sessionStorage.setItem(cacheKey, JSON.stringify(cacheData)); console.log('✅ 새로운 데이터 캐시 저장');
            setIsLiveData(true); setError(null);
        } catch (apiError) { setIsLiveData(false); setError('API 연결 실패.'); setAllEtfData(getUSETFData()); } finally { setLoading(false); setLastUpdated(new Date()); }
    }, [apiService]);
    useEffect(() => { fetchETFData(); }, [fetchETFData]);
    const filteredData = useMemo(() => {
        let dataToProcess = allEtfData;
        if (filters.country !== 'ALL') dataToProcess = dataToProcess.filter(etf => etf.country === filters.country);
        const term = filters.searchTerm.toLowerCase().trim();
        if (term) dataToProcess = dataToProcess.filter(etf => etf.name.toLowerCase().includes(term) || etf.code.toLowerCase().includes(term));
        if (filters.hideLowVolume) dataToProcess = dataToProcess.filter(etf => etf.country === 'US' || etf.tradingValue >= 500000000);
        return [...dataToProcess].sort((a, b) => { const aValue = a[sortOptions.field]; const bValue = b[sortOptions.field]; if (aValue === undefined || bValue === undefined) return 0; let comparison = typeof aValue === 'string' ? aValue.localeCompare(bValue, 'ko') : (aValue as number) - (bValue as number); return sortOptions.direction === 'desc' ? -comparison : comparison; });
    }, [allEtfData, filters, sortOptions]);
    const koreaCount = useMemo(() => allEtfData.filter(e => e.country === 'KR').length, [allEtfData]);
    const usCount = useMemo(() => allEtfData.filter(e => e.country === 'US').length, [allEtfData]);
    const { highestDailyChangeETF, highestVolumeETF } = useMemo(() => {
        const koreaData = allEtfData.filter(e => e.country === 'KR'); if (koreaData.length === 0) return { highestDailyChangeETF: null, highestVolumeETF: null };
        const noLeverageData = koreaData.filter(e => !e.name.includes('인버스') && !e.name.includes('레버리지'));
        const highestChange = noLeverageData.length > 0 ? [...noLeverageData].sort((a, b) => b.yield - a.yield)[0] : null;
        const highestVolume = [...koreaData].sort((a, b) => b.volume - a.volume)[0];
        return { highestDailyChangeETF: highestChange, highestVolumeETF: highestVolume };
    }, [allEtfData]);
    return { filteredData, loading, error, lastUpdated, isLiveData, koreaCount, usCount, highestDailyChangeETF, highestVolumeETF, refetch: fetchETFData, setFilters, setSortOptions, filters, sortOptions };
}
