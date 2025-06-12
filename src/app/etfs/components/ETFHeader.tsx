// /app/etfs/components/ETFHeader.tsx
import { ETFTab } from '../types/api';

interface ETFHeaderProps {
    activeTab: ETFTab;
    setActiveTab: (tab: ETFTab) => void;
    search: string;
    setSearch: (search: string) => void;
}

export default function ETFHeader({
                                      activeTab,
                                      setActiveTab,
                                      search,
                                      setSearch
                                  }: ETFHeaderProps) {
    return (
        <div
            className="p-4 md:p-6 lg:p-8 rounded-xl hover-lift"
            style={{
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--color-shadow)'
            }}
        >
            {/* 탭 버튼과 검색창을 한 줄로 배치 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex gap-2 md:gap-3">
                    <button
                        className={`px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all text-sm md:text-base lg:text-lg ${
                            activeTab === 'KR'
                                ? 'text-white shadow-lg transform scale-105 bg-gradient-to-r from-blue-500 to-blue-600'
                                : 'hover:transform hover:scale-105 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                        }`}
                        style={activeTab === 'KR'
                            ? {}
                            : { color: 'var(--color-text-primary)' }
                        }
                        onClick={() => setActiveTab('KR')}
                    >
                        🇰🇷 국내 ETF
                    </button>
                    <button
                        className={`px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all text-sm md:text-base lg:text-lg ${
                            activeTab === 'US'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                                : 'hover:transform hover:scale-105 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                        }`}
                        style={activeTab === 'US'
                            ? {}
                            : { color: 'var(--color-text-primary)' }
                        }
                        onClick={() => setActiveTab('US')}
                    >
                        🇺🇸 미국 ETF
                    </button>
                </div>

                {/* 검색창 - 한 줄로 복원 */}
                <div className="flex-1 relative md:ml-6">
                    <input
                        className="w-full px-4 md:px-6 py-3 md:py-4 rounded-lg text-sm md:text-base lg:text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gradient-to-r from-white to-gray-50 border-2"
                        style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-primary)'
                        }}
                        placeholder="ETF명, 코드, 운용사로 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <div
                        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-lg md:text-xl"
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        🔍
                    </div>
                </div>
            </div>

            {/* 현재 선택된 탭 정보 */}
            <div className="mt-4 md:mt-6 flex items-center gap-2">
                <div
                    className={`w-3 h-3 rounded-full ${
                        activeTab === 'KR' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                ></div>
                <span className="font-medium text-sm md:text-base" style={{ color: 'var(--color-text-primary)' }}>
          {activeTab === 'KR' ? '국내 Api' : '미국 Api'}
        </span>

                <div className="ml-auto">
                    <span className="mx-2 text-xs md:text-sm" style={{ color: 'var(--color-text-secondary)' }}>•</span>
                    <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-secondary)' }}>실시간 정보 제공</span>
                </div>
            </div>
        </div>
    );
}
