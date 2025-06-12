// /app/etfs/components/ETFModal.tsx
'use client';

import React from 'react';
import { ETF } from '../types/etf';

interface ETFModalProps {
    etf: ETF;
    isOpen: boolean;
    onClose: () => void;
}

export default function ETFModal({ etf, isOpen, onClose }: ETFModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold text-white ${
                                etf.country === 'KR' ? 'bg-blue-500' : 'bg-red-500'
                            }`}>
                                {etf.country}
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{etf.name}</h3>
                                <p className="text-sm text-gray-500">{etf.code}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">운용사</label>
                                <p className="text-lg font-semibold">{etf.provider}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">수수료</label>
                                <p className="text-lg font-semibold">{etf.fee}%</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">연수익률</label>
                                <p className={`text-lg font-semibold ${
                                    etf.yield >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {etf.yield > 0 ? '+' : ''}{etf.yield}%
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">거래량</label>
                                <p className="text-lg font-semibold">{etf.volume.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">현재가</label>
                                <p className="text-lg font-semibold">
                                    {etf.country === 'KR' ? '₩' : '$'}
                                    {etf.marketPrice?.toLocaleString() || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">자산규모</label>
                                <p className="text-lg font-semibold">{etf.aum || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {etf.description && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <label className="text-sm font-medium text-gray-500">설명</label>
                            <p className="text-sm text-gray-700 mt-1">{etf.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
