import { NextResponse } from 'next/server';

const BASE_PAYLOAD = {
  asset: "USDT",
  fiat: "VES",
  merchantCheck: true,
  page: 1,
  rows: 20,
  publisherType: "merchant",
  transAmount: "30000",
};

const PAYLOAD_BUY = { ...BASE_PAYLOAD, tradeType: "BUY" };
const PAYLOAD_SELL = { ...BASE_PAYLOAD, tradeType: "SELL" };

const calculateRobustAverage = (ads: any[]) => {
  if (!ads || ads.length === 0) return 0;

  const validPrices = ads
    .filter((item) => item.advertiser.monthFinishRate >= 0.94)
    .map((item) => parseFloat(item.adv.price));

  const uniquePrices = [...new Set(validPrices)];

  if (uniquePrices.length === 0) return 0;

  const sum = uniquePrices.reduce((a, b) => a + b, 0);
  return sum / uniquePrices.length;
};

async function getBinanceData(payload: any) {
  const response = await fetch(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: 'no-store'
    }
  );

  if (!response.ok)
    throw new Error(`Binance API Error: ${response.statusText}`);
  return response.json();
}

export async function GET() {
  try {
    const [buyRaw, sellRaw] = await Promise.all([
      getBinanceData(PAYLOAD_BUY),
      getBinanceData(PAYLOAD_SELL)
    ]);

    const finalBuy = calculateRobustAverage(buyRaw.data);
    const finalSell = calculateRobustAverage(sellRaw.data);
    
    // We can use the average or finalSell as price. Usually finalSell or average is used as a reference.
    const price = (finalBuy + finalSell) / 2;

    if (isNaN(price) || price === 0) {
      return NextResponse.json({ error: 'No se pudo calcular el precio' }, { status: 500 });
    }

    return NextResponse.json({ price, buy: finalBuy, sell: finalSell });

  } catch (error) {
    console.error('Error al obtener el precio USDT:', error);
    return NextResponse.json({ error: 'Error al obtener el precio de USDT' }, { status: 500 });
  }
}
