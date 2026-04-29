'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CalculadoraUsdt({ hideTitle = false, hideLink = false }: { hideTitle?: boolean, hideLink?: boolean }) {

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [bsAmount, setBsAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dolarUsdt', { mode: 'cors' });
      const data = await response.json();
      const priceEl = data.price;
      if (!priceEl) throw new Error('Precio no encontrado');
      setPrice(parseFloat(priceEl));
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPrice(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  const handleUsdtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUsdtAmount(value);
    setBsAmount('');
  };

  const handleBsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setBsAmount(value);
    setUsdtAmount('');
  };

  const calculateFromUsdt = usdtAmount && price
    ? (parseFloat(usdtAmount) * price).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0';

  const calculateFromBs = bsAmount && price
    ? (parseFloat(bsAmount) / price).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0';

  return (
    <div className="w-full max-w-md font-sans">
      {!hideTitle && (
        <div className="text-center mb-8">
          <h1 className="font-mono text-sm tracking-widest text-gray-500 uppercase mb-2">
            Dólar USDT (Binance)
          </h1>
        </div>
      )}


      <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center mb-6 relative overflow-hidden ${loading ? 'opacity-50' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        <p className="text-gray-400 text-sm mb-2">Precio promedio actual</p>
        <p className="font-mono text-5xl font-bold text-yellow-500 leading-none">
          {loading ? '...' : price?.toFixed(2)}
          {!loading && <span className="text-gray-400 text-lg ml-1">Bs</span>}
        </p>
        <div className="mt-2 text-xs text-gray-500 font-mono">
           El precio se calcula como el promedio de compra y venta en P2P
        </div>
        {lastUpdate && (
          <p className="text-gray-500 text-xs mt-4 font-mono">
            Actualizado: {lastUpdate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-5 font-mono">Calculadora</p>

        <div className="mb-4">
          <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2">Monto en USDT</label>
          <div className="relative">
            <input
              type="text"
              value={usdtAmount}
              onChange={handleUsdtChange}
              placeholder="0.00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3.5 px-4 text-lg text-white font-mono outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all"
            />
            <span className="absolute right-4 text-gray-500 font-mono text-sm top-1/2 -translate-y-1/2">USDT</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2">Monto en bolívares (BS)</label>
          <div className="relative">
            <input
              type="text"
              value={bsAmount}
              onChange={handleBsChange}
              placeholder="0.00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3.5 px-4 text-lg text-white font-mono outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all"
            />
            <span className="absolute right-4 text-gray-500 font-mono text-sm top-1/2 -translate-y-1/2">BS</span>
          </div>
        </div>

        <div className="mt-6 p-5 bg-zinc-950 rounded-xl text-center border border-zinc-800">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Resultado</p>
          {usdtAmount && (
            <p className="font-mono text-2xl font-bold text-white mb-2">
              {calculateFromUsdt} <span className="text-gray-400 text-base">BS</span>
            </p>
          )}
          {bsAmount && (
            <p className="font-mono text-2xl font-bold text-white">
              {calculateFromBs} <span className="text-gray-400 text-base">USDT</span>
            </p>
          )}
          {!usdtAmount && !bsAmount && (
            <p className="font-mono text-2xl font-bold text-gray-500">
              0.00
            </p>
          )}
        </div>

        <button
          onClick={fetchPrice}
          className="w-full mt-4 py-3 bg-transparent border border-zinc-800 rounded-lg text-gray-400 text-sm font-mono flex items-center justify-center gap-2 hover:border-yellow-500 hover:text-yellow-500 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Actualizar precio
        </button>
        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
      </div>

      {!hideLink && (
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-yellow-500 text-sm font-mono transition-colors">
            → Ir a Calculadora BCV
          </Link>
        </div>
      )}

    </div>
  );
}
