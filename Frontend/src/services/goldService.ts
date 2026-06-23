const BASE = "https://www.alphavantage.co/query";
const KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY as string;

export interface GoldSpot {
  price: number;
  timestamp: string;
}

export interface GoldCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Fetch real-time XAU/USD price via CURRENCY_EXCHANGE_RATE */
export async function fetchGoldSpot(): Promise<GoldSpot | null> {
  try {
    const res = await fetch(
      `${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${KEY}`
    );
    const data = await res.json();
    const rate = data["Realtime Currency Exchange Rate"];
    if (!rate) return null;
    return {
      price: parseFloat(rate["5. Exchange Rate"]),
      timestamp: rate["6. Last Refreshed"],
    };
  } catch {
    return null;
  }
}

/** Fetch daily XAU/USD candles for the last N days via FX_DAILY */
export async function fetchGoldCandles(days = 30): Promise<GoldCandle[]> {
  try {
    const res = await fetch(
      `${BASE}?function=FX_DAILY&from_symbol=XAU&to_symbol=USD&outputsize=compact&apikey=${KEY}`
    );
    const data = await res.json();
    const series: Record<string, Record<string, string>> = data["Time Series FX (Daily)"] ?? {};
    return Object.entries(series)
      .slice(0, days)
      .reverse()
      .map(([date, v]) => ({
        time: date,
        open: parseFloat(v["1. open"]),
        high: parseFloat(v["2. high"]),
        low: parseFloat(v["3. low"]),
        close: parseFloat(v["4. close"]),
      }));
  } catch {
    return [];
  }
}
