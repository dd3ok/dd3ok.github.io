// /app/etfs/components/ETFCard.tsx
import { Api } from '../types/api';

interface ETFCardProps {
    etfs: Api[];
    onETFClick: (etf: Api) => void;
}

export default function ETFCard({ etfs, onETFClick }: ETFCardProps) {
    return (
        <div className="space-y-4">
            {etfs.map((etf) => (
                <div
                    key={etf.code}
                    className="p-5 rounded-xl hover-lift cursor-pointer transition-all border bg-gradient-to-r from-white to-gray-50"
                    style={{
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--color-shadow)'
                    }}
                    onClick={() => onETFClick(etf)}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                {etf.name}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {etf.code} • {etf.provider}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
              <span className={`text-xl ${
                  etf.country === 'US' ? 'text-red-500' : ''
              }`}
                    style={etf.country === 'KR' ? { color: 'var(--color-primary)' } : {}}>
                {etf.country === 'US' ? '🇺🇸' : '🇰🇷'}
              </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                etf.yield >= 0
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                {etf.yield > 0 ? '+' : ''}{etf.yield}%
              </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs font-medium text-blue-600 mb-1">수수료</p>
                            <p className="font-mono font-semibold text-sm text-blue-700">{etf.fee}%</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-xs font-medium text-purple-600 mb-1">거래량</p>
                            <p className="font-mono font-semibold text-sm text-purple-700">
                                {etf.volume.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            상장일: {etf.listedAt}
                        </div>
                        <button
                            className="font-medium text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300 hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                            상세보기 →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
