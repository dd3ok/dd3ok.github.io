'use client';

import React, { useState, useCallback } from 'react';
import { useETFData } from './hooks/useETFData';
import ETFTable from './components/ETFTable';
import StatCards from './components/StatCards';
import FilterBar from './components/FilterBar';
import { ETF, ETFSortOptions } from './types/etf';

type SortField = keyof Pick<
    ETF,
    | 'name'
    | 'provider'
    | 'marketCap'
    | 'fee'
    | 'tradingValue'
    | 'volume'
    | 'yield'
    | 'marketPrice'
>;

export default function ETFsPage() {
    const [, setSelectedETF] = useState<ETF | null>(null);
    const {
        filteredData,
        loading,
        isLiveData,
        koreaCount,
        usCount,
        highestDailyChangeETF,
        highestVolumeETF,
        setFilters,
        filters,
        sortOptions,
        setSortOptions,
    } = useETFData();

    const handleCountryFilterChange = useCallback(
        (country: 'KR' | 'US') => {
            setFilters((prev) => ({ ...prev, country, searchTerm: '' }));
        },
        [setFilters]
    );
    const handleSearchChange = useCallback(
        (term: string) => {
            setFilters((prev) => ({ ...prev, searchTerm: term }));
        },
        [setFilters]
    );
    const handleHideLowVolumeChange = useCallback(
        (checked: boolean) => {
            setFilters((prev) => ({ ...prev, hideLowVolume: checked }));
        },
        [setFilters]
    );
    const handleSortChange = useCallback(
        (field: SortField) => {
            setSortOptions((prev: ETFSortOptions) => ({
                field,
                direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
            }));
        },
        [setSortOptions]
    );
    const handleETFClick = useCallback((etf: ETF) => setSelectedETF(etf), []);
    const handleCloseModal = useCallback(() => setSelectedETF(null), []);

    if (loading && filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-slate-700 font-medium">Loading ETF LIVE</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white font-sans">
            <header className="relative z-10 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-5 max-w-4xl">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-blue-800 mb-2">
                            ETF LIVE
                        </h1>
                        <p className="text-base text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
                            국내 및 미국 ETF의 거래량, 등락률을 한눈에 비교하세요
                        </p>
                    </div>
                </div>
                <div className="h-px bg-slate-200/70" />
            </header>

            {/* 메인 콘텐츠 */}
            <main className="bg-slate-50 pt-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
                    {/* 통계 카드 */}
                    <section className="mb-12">
                        <StatCards
                            koreaCount={koreaCount}
                            usCount={usCount}
                            highestDailyChangeETF={highestDailyChangeETF}
                            highestVolumeETF={highestVolumeETF}
                        />
                    </section>
                    {/* 필터 + 테이블 */}
                    <section className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-lg overflow-hidden">
                        <div className="p-8">
                            <FilterBar
                                activeFilter={filters.country}
                                onFilterChange={handleCountryFilterChange}
                                searchTerm={filters.searchTerm}
                                onSearchChange={handleSearchChange}
                                isLive={isLiveData}
                                hideLowVolume={filters.hideLowVolume}
                                onHideLowVolumeChange={handleHideLowVolumeChange}
                            />
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent"></div>
                        <div className="p-8 pt-6">
                            <ETFTable
                                etfs={filteredData}
                                onETFClick={handleETFClick}
                                loading={loading}
                                sortOptions={sortOptions}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
