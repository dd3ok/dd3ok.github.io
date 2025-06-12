// 경로: src/app/etfs/components/ETFTable.tsx

import React from 'react';
import {ETF, ETFSortOptions} from '../types/etf';

type SortField = keyof Pick<ETF, 'name' | 'provider' | 'marketCap' | 'fee' | 'tradingValue' | 'volume' | 'yield' | 'marketPrice'>;

interface ETFTableProps {
    etfs: ETF[];
    onETFClick: (etf: ETF) => void;
    loading: boolean;
    sortOptions: ETFSortOptions;
    onSortChange: (field: SortField) => void;
}

export default function ETFTable({etfs, onETFClick, loading, sortOptions, onSortChange}: ETFTableProps) {
    const SortIcon = ({field}: { field: SortField }) => {
        if (sortOptions.field !== field) return <svg className="w-4 h-4 ml-1 opacity-30" fill="currentColor"
                                                     viewBox="0 0 20 20">
            <path d="M5 12l5-5 5 5H5z"/>
        </svg>;
        return <svg
            className={`w-4 h-4 ml-1 transition-transform ${sortOptions.direction === 'desc' ? 'rotate-180' : ''}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 12l5-5 5 5H5z"/>
        </svg>;
    };

    // ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
    // [핵심 수정] 모든 포맷팅 함수에 null/undefined 안전장치를 추가합니다.
    // ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
    const formatMarketCap = (cap?: number) => {
        if (cap == null) return 'N/A';
        if (cap >= 1000000000000) {
            const jo = Math.floor(cap / 1000000000000);
            const eok = Math.round((cap % 1000000000000) / 100000000);
            return eok > 0 ? `${jo}조 ${eok}억` : `${jo}조`;
        }
        if (cap >= 100000000) {
            return `${Math.round(cap / 100000000)}억`;
        }
        return `${cap.toLocaleString()}원`;
    };
    const formatTradingValue = (value?: number) => {
        if (value == null) return 'N/A';
        if (value >= 100000000) {
            return `${Math.round(value / 100000000)}억`;
        }
        return `${Math.round(value / 10000)}만`;
    };
    const formatVolume = (volume?: number) => volume?.toLocaleString() ?? 'N/A';

    if (loading) return <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="ml-4 text-secondary-500">데이터를 불러오는 중...</p></div>;
    if (etfs.length === 0) return <div className="text-center py-16 px-4 bg-surface rounded-xl shadow-soft"><h3
        className="text-xl font-semibold text-secondary-700">표시할 데이터가 없습니다.</h3><p
        className="mt-2 text-secondary-500">다른 필터나 검색어를 시도해 보세요.</p></div>;

    return (
        <div className="rounded-xl overflow-hidden border bg-surface border-secondary-200 shadow-soft">
            <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{minWidth: '1000px'}}>
                    <thead className="bg-secondary-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('name')}>
                            <div className="flex items-center">종목명 <SortIcon field="name"/></div>
                        </th>
                        {/*<th className="px-4 py-3 text-left font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap" onClick={() => onSortChange('provider')}><div className="flex items-center">운용사 <SortIcon field="provider" /></div></th>*/}
                        <th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('marketCap')}>
                            <div className="flex items-center justify-end">시가총액 <SortIcon field="marketCap"/></div>
                        </th>
                        {/*<th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap" onClick={() => onSortChange('fee')}><div className="flex items-center justify-end">운용 보수(%) <SortIcon field="fee" /></div></th>*/}
                        <th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('volume')}>
                            <div className="flex items-center justify-end">거래량 <SortIcon field="volume"/></div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('tradingValue')}>
                            <div className="flex items-center justify-end">거래대금 <span className="ml-1 cursor-help"
                                                                                      title="추정 거래대금 (현재가 x 거래량)"><svg
                                xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round"
                                                                                strokeLinejoin="round" strokeWidth={2}
                                                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span><SortIcon
                                field="tradingValue"/></div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('yield')}>
                            <div className="flex items-center justify-end">일일 등락률(%) <SortIcon field="yield"/></div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-secondary-600 cursor-pointer hover:bg-secondary-100 whitespace-nowrap"
                            onClick={() => onSortChange('marketPrice')}>
                            <div className="flex items-center justify-end">현재가 <SortIcon field="marketPrice"/></div>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                    {etfs.map((etf) => (<tr key={etf.code}
                                            className="hover:bg-secondary-50 transition-colors duration-150 cursor-pointer"
                                            onClick={() => onETFClick(etf)}>
                        <td className="px-4 py-3">
                            <div className="font-semibold text-secondary-800">{etf.name}</div>
                            <div className="text-xs text-secondary-500">{etf.code}</div>
                        </td>
                        {/*<td className="px-4 py-3 text-secondary-600 whitespace-nowrap">{etf.provider}</td>*/}
                        <td className="px-4 py-3 text-right text-secondary-600 whitespace-nowrap">{formatMarketCap(etf.marketCap)}</td>
                        {/*<td className="px-4 py-3 text-right text-secondary-600 whitespace-nowrap">{etf.fee.toFixed(3)}</td>*/}
                        <td className="px-4 py-3 text-right text-secondary-600 whitespace-nowrap">{formatVolume(etf.volume)}</td>
                        <td className="px-4 py-3 text-right text-secondary-600 whitespace-nowrap">{formatTradingValue(etf.tradingValue)}</td>
                        <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${etf.yield > 0 ? 'text-red-500' : 'text-blue-500'}`}>{etf.yield.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-right font-semibold text-secondary-800 whitespace-nowrap">{etf.marketPrice.toLocaleString()}{etf.country === 'KR' ? '원' : '$'}</td>
                    </tr>))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-secondary-200"><span
                className="text-sm text-secondary-700">총 <span
                className="font-semibold">{etfs.length}</span>개 종목 표시</span></div>
        </div>
    );
}

