// 경로: src/app/etfs/components/StatCards.tsx

import React from 'react';
import { ETF } from '../types/etf';
interface StatCardProps { icon: string; title: string; value: string; subtitle?: string; bgColor: string; textColor: string; }
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, bgColor, textColor }) => {
    return (
        <div className={`flex items-start p-4 rounded-xl shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${bgColor}`}>
            <div className={`text-2xl mr-4 ${textColor} bg-white/60 p-2 rounded-lg`}>{icon}</div>
            <div className="flex-1">
                <p className={`text-sm font-semibold ${textColor} opacity-80`}>{title}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                {subtitle && <p className={`text-xs truncate ${textColor} opacity-70 mt-1`}>{subtitle}</p>}
            </div>
        </div>
    );
};
interface StatCardsProps { koreaCount: number; usCount: number; highestDailyChangeETF: ETF | null; highestVolumeETF: ETF | null; }
export default function StatCards({ koreaCount = 0, usCount = 0, highestDailyChangeETF, highestVolumeETF }: StatCardsProps) {
    const formatTradingValue = (value?: number) => { if (value == null) return 'N/A'; if (value >= 100000000) { return `${Math.round(value / 100000000)}억`; } return `${Math.round(value / 10000)}만`; };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon="🇰🇷" title="국내 ETF" value={`${koreaCount}개`} bgColor="bg-primary-50" textColor="text-primary-800" />
            <StatCard icon="🇺🇸" title="미국 ETF" value={`${usCount}개`} bgColor="bg-red-50" textColor="text-red-800" />
            <StatCard icon="🚀" title="최고 일일수익률" value={highestDailyChangeETF ? `+${highestDailyChangeETF.yield.toFixed(2)}%` : 'N/A'} subtitle={highestDailyChangeETF?.name} bgColor="bg-green-50" textColor="text-green-800" />
            <StatCard icon="🔥" title="최다 거래대금" value={formatTradingValue(highestVolumeETF?.tradingValue)} subtitle={highestVolumeETF?.name} bgColor="bg-purple-50" textColor="text-purple-800" />
        </div>
    );
}

