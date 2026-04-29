'use client';

import { useState } from 'react';
import CalculadoraDolar from './CalculadoraDolar';
import CalculadoraUsdt from './CalculadoraUsdt';

export default function MainCalculator({ initialTab = 'bcv' }: { initialTab?: 'bcv' | 'usdt' }) {
  const [activeTab, setActiveTab] = useState<'bcv' | 'usdt'>(initialTab);

  return (
    <div className="w-full max-w-md">
      <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6 relative">
        <button
          onClick={() => setActiveTab('bcv')}
          className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all rounded-lg z-10 ${
            activeTab === 'bcv'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          DÓLAR BCV
        </button>
        <button
          onClick={() => setActiveTab('usdt')}
          className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all rounded-lg z-10 ${
            activeTab === 'usdt'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          DÓLAR USDT
        </button>
        
        {/* Active Indicator Slider */}
        <div 
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out bg-zinc-800 border border-zinc-700 shadow-xl ${
            activeTab === 'usdt' ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className={`absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent ${activeTab === 'bcv' ? 'via-green-500' : 'via-yellow-500'} to-transparent`} />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'bcv' ? (
          <CalculadoraDolar hideTitle hideLink />
        ) : (
          <CalculadoraUsdt hideTitle hideLink />
        )}
      </div>
    </div>
  );
}
