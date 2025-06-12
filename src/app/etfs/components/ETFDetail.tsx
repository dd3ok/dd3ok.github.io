// /app/etfs/components/ETFDetail.tsx
import { Api } from '../types/api';

interface ETFDetailProps {
    etf: Api;
    onClose: () => void;
}

export default function ETFDetail({ etf, onClose }: ETFDetailProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className="w-full max-w-3xl rounded-2xl scale-in overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                {/* 헤더 */}
                <div
                    className="p-8"
                    style={{
                        backgroundColor: etf.country === 'US' ? '#fef2f2' : 'var(--color-surface-alt)'
                    }}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                                {etf.name}
                            </h2>
                            <div className="flex items-center gap-4">
                <span
                    className="px-4 py-2 rounded-full text-base font-mono"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  {etf.code}
                </span>
                                <span
                                    className={`px-4 py-2 rounded-full text-base font-medium text-white ${
                                        etf.country === 'US' ? 'bg-red-500' : ''
                                    }`}
                                    style={etf.country === 'KR' ? { backgroundColor: 'var(--color-primary)' } : {}}
                                >
                  {etf.country === 'US' ? '🇺🇸 미국 Api' : '🇰🇷 국내 Api'}
                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-3xl font-bold p-3 hover:bg-black/10 rounded-full transition-colors"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* 상세 정보 */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    운용사
                                </h4>
                                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {etf.provider}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    운용수수료
                                </h4>
                                <p className="text-xl font-semibold font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {etf.fee}%
                                </p>
                            </div>
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    추적지수
                                </h4>
                                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {etf.index || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    거래량
                                </h4>
                                <p className="text-xl font-semibold font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {etf.volume.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    연수익률
                                </h4>
                                <p className={`text-3xl font-bold font-mono ${
                                    etf.yield >= 0 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                    {etf.yield > 0 ? '+' : ''}{etf.yield}%
                                </p>
                            </div>
                            <div>
                                <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    상장일
                                </h4>
                                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {etf.listedAt}
                                </p>
                            </div>
                        </div>
                    </div>

                    {etf.aum && (
                        <div
                            className="rounded-lg p-6 mb-8"
                            style={{ backgroundColor: 'var(--color-surface-alt)' }}
                        >
                            <h4 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                순자산총액(AUM)
                            </h4>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {etf.aum}
                            </p>
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-4">
                        <button
                            className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all hover-lift ${
                                etf.country === 'US' ? 'bg-red-500 hover:bg-red-600' : ''
                            }`}
                            style={etf.country === 'KR' ? {
                                backgroundColor: 'var(--color-primary)',
                            } : {}}
                            onMouseEnter={(e) => {
                                if (etf.country === 'KR') {
                                    e.target.style.backgroundColor = 'var(--color-primary-hover)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (etf.country === 'KR') {
                                    e.target.style.backgroundColor = 'var(--color-primary)';
                                }
                            }}
                        >
                            관심종목 추가
                        </button>
                        <button
                            className="flex-1 py-4 px-6 rounded-lg font-semibold transition-all hover-lift"
                            style={{
                                border: `2px solid var(--color-border)`,
                                color: 'var(--color-text-primary)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-surface-alt)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            유사 ETF 비교
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
