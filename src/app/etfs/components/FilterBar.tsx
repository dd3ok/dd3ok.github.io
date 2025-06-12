// 경로: src/app/etfs/components/FilterBar.tsx

import React from 'react';
interface FilterBarProps { activeFilter: 'KR' | 'US' | 'ALL'; onFilterChange: (filter: 'KR' | 'US') => void; searchTerm: string; onSearchChange: (term: string) => void; isLive: boolean; hideLowVolume: boolean; onHideLowVolumeChange: (checked: boolean) => void; }
export default function FilterBar({ activeFilter, onFilterChange, searchTerm, onSearchChange, isLive, hideLowVolume, onHideLowVolumeChange }: FilterBarProps) {
    const getTabClasses = (filter: 'KR' | 'US') => {
        const baseClasses = "px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base";
        if (activeFilter === filter) return `${baseClasses} bg-primary-600 text-white shadow-soft`;
        return `${baseClasses} bg-secondary-200 text-secondary-600 hover:bg-secondary-300`;
    };
    return (
        <div className="p-4 bg-surface rounded-xl shadow-soft border border-secondary-200">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 p-1 bg-secondary-100 rounded-lg w-full md:w-auto justify-center">
                    <button className={getTabClasses('KR')} onClick={() => onFilterChange('KR')}>🇰🇷 국내 ETF</button>
                    <button className={getTabClasses('US')} onClick={() => onFilterChange('US')}>🇺🇸 미국 ETF</button>
                </div>
                <div className="relative flex-grow w-full md:w-auto">
                    <input type="text" placeholder="ETF명, 코드로 빠르게 검색..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-4 pr-10 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"/>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="ml-auto flex items-center space-x-2 flex-shrink-0">
                    <input type="checkbox" id="hide-low-volume" checked={hideLowVolume} onChange={(e) => onHideLowVolumeChange(e.target.checked)} className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"/>
                    <label htmlFor="hide-low-volume" className="text-sm text-secondary-700 select-none">거래대금 5억 미만 숨기기</label>
                </div>
            </div>
            <div className="flex items-center mt-3 text-xs text-secondary-500">
                <span className={`ml-auto w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                {isLive ? '실시간 정보 제공' : '폴백(샘플) 데이터'}
            </div>
        </div>
    );
}

