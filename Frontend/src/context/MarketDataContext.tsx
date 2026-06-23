import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { marketSocket, type ConnectionStatus, type MarketSocketMessage } from "../services/websocket/marketSocket";

export interface MarketSnapshot {
  pair: string;
  price: number;
  change: number;
  percentageChange: number;
  lastUpdated: string;
}

interface MarketDataContextValue {
  marketData: Record<string, MarketSnapshot>;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
  refresh: () => void;
}

const DEFAULT_PAIRS = ["XAUUSD", "EURUSD", "GBPUSD", "AUDUSD", "USDCAD", "EURGBP", "BTCUSD"];

const MarketDataContext = createContext<MarketDataContextValue | undefined>(undefined);

const initialSnapshots = (): Record<string, MarketSnapshot> => ({
  XAUUSD: { pair: "XAUUSD", price: 3412.56, change: 14.2, percentageChange: 0.42, lastUpdated: new Date().toISOString() },
  EURUSD: { pair: "EURUSD", price: 1.08432, change: 0.0012, percentageChange: 0.11, lastUpdated: new Date().toISOString() },
  GBPUSD: { pair: "GBPUSD", price: 1.26748, change: -0.0021, percentageChange: -0.17, lastUpdated: new Date().toISOString() },
  AUDUSD: { pair: "AUDUSD", price: 0.64892, change: -0.0019, percentageChange: -0.29, lastUpdated: new Date().toISOString() },
  USDCAD: { pair: "USDCAD", price: 1.36124, change: 0.0010, percentageChange: 0.07, lastUpdated: new Date().toISOString() },
  EURGBP: { pair: "EURGBP", price: 0.85492, change: 0.0034, percentageChange: 0.40, lastUpdated: new Date().toISOString() },
  BTCUSD: { pair: "BTCUSD", price: 67124.12, change: 312.56, percentageChange: 0.47, lastUpdated: new Date().toISOString() },
});

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<Record<string, MarketSnapshot>>(initialSnapshots);
  const [selectedPair, setSelectedPair] = useState("XAUUSD");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");

  const refresh = useCallback(() => {
    setMarketData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(prev).map(([pair, snapshot]) => [
          pair,
          { ...snapshot, lastUpdated: new Date().toISOString() },
        ])
      ),
    }));
  }, []);

  useEffect(() => {
    marketSocket.connect();
    const unsubscribe = marketSocket.addMessageListener((message: MarketSocketMessage) => {
      if (message.type === "STATUS_UPDATE" && message.data?.status) {
        setConnectionStatus(message.data.status as ConnectionStatus);
        return;
      }

      const pair = (message.pair ?? message.symbol ?? "") as string;
      if (!pair || !DEFAULT_PAIRS.includes(pair)) {
        return;
      }

      const price = Number(message.price ?? 0);
      if (!Number.isFinite(price) || price <= 0) {
        return;
      }

      setMarketData((prev) => {
        const existing = prev[pair];
        const previousPrice = existing?.price ?? price;
        const change = Number((price - previousPrice).toFixed(5));
        const percentageChange = previousPrice ? Number(((change / previousPrice) * 100).toFixed(2)) : 0;

        return {
          ...prev,
          [pair]: {
            pair,
            price,
            change,
            percentageChange,
            lastUpdated: message.timestamp ?? new Date().toISOString(),
          },
        };
      });
    });

    marketSocket.subscribe(DEFAULT_PAIRS);

    return () => {
      unsubscribe();
      marketSocket.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      marketData,
      isConnected: connectionStatus === "open",
      connectionStatus,
      selectedPair,
      setSelectedPair,
      refresh,
    }),
    [connectionStatus, marketData, refresh, selectedPair]
  );

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
}
