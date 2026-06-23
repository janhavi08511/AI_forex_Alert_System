import { Configuration } from "./oanda-client/runtime";
import { V2Api, V2CandlesExtEnum, V2CandlesFieldsEnum, V2SpotExtEnum } from "./oanda-client/apis/V2Api";
import type { V2Spot200ResponseQuotesInner } from "./oanda-client/models/V2Spot200ResponseQuotesInner";
import type { V2Candle } from "./oanda-client/models/V2Candle";

export type { V2Spot200ResponseQuotesInner as OandaSpotQuote, V2Candle as OandaCandleQuote };

const config = new Configuration({
  basePath: "https://exchange-rates-api.oanda.com",
  apiKey: () => `Bearer ${import.meta.env.VITE_OANDA_API_KEY as string}`,
});

const v2 = new V2Api(config);

/** Fetch real-time XAU/USD spot rate */
export async function fetchGoldSpot(): Promise<V2Spot200ResponseQuotesInner | null> {
  try {
    const res = await v2.v2Spot({ ext: V2SpotExtEnum.Json, base: ["XAU"], quote: ["USD"] });
    return res.quotes?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch daily candles for XAU/USD over the last N days */
export async function fetchGoldCandles(days = 30): Promise<V2Candle[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    const fmt = (d: Date) => `${d.toISOString().split("T")[0]}T00:00:00+00:00`;

    const res = await v2.v2Candles({
      ext: V2CandlesExtEnum.Json,
      base: ["XAU"],
      quote: ["USD"],
      startTime: fmt(start),
      endTime: fmt(end),
      fields: [V2CandlesFieldsEnum.All],
    });
    return res.quotes ?? [];
  } catch {
    return [];
  }
}
