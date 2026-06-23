export type MarketSocketMessage = {
  type?: string;
  pair?: string;
  symbol?: string;
  price?: number;
  change?: number;
  percentageChange?: number;
  timestamp?: string;
  data?: Record<string, unknown>;
};

export type ConnectionStatus = "idle" | "connecting" | "open" | "closed" | "error";

const FINNHUB_TICKER_MAP: Record<string, string> = {
  XAUUSD: "OANDA:XAU_USD",
  EURUSD: "OANDA:EUR_USD",
  GBPUSD: "OANDA:GBP_USD",
  AUDUSD: "OANDA:AUD_USD",
  USDCAD: "OANDA:USD_CAD",
  EURGBP: "OANDA:EUR_GBP",
  BTCUSD: "BINANCE:BTCUSDT",
};

const FINNHUB_REVERSE_MAP = Object.fromEntries(
  Object.entries(FINNHUB_TICKER_MAP).map(([friendly, finnhub]) => [finnhub, friendly])
);

class MarketSocketService {
  private socket: WebSocket | null = null;
  private listeners = new Set<(message: MarketSocketMessage) => void>();
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private status: ConnectionStatus = "idle";
  private readonly apiKey = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined;
  private readonly endpoint = this.apiKey ? `wss://ws.finnhub.io?token=${this.apiKey}` : "";
  private pendingSubscriptions = new Set<string>();

  connect() {
    if (typeof window === "undefined" || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    if (!this.apiKey) {
      this.status = "error";
      this.notifyStatus();
      console.error("Missing VITE_FINNHUB_API_KEY in .env");
      return;
    }

    this.status = "connecting";
    this.notifyStatus();

    try {
      this.socket = new WebSocket(this.endpoint);

      this.socket.onopen = () => {
        this.status = "open";
        this.reconnectAttempts = 0;
        this.notifyStatus();
        this.pendingSubscriptions.forEach((symbol) => this.sendSubscribe(symbol));
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data as string);
          if (payload.type === "trade" && Array.isArray(payload.data)) {
            payload.data.forEach((trade: any) => {
              const friendlyPair = FINNHUB_REVERSE_MAP[trade.s] || trade.s;
              const message: MarketSocketMessage = {
                type: "trade",
                symbol: trade.s,
                pair: friendlyPair,
                price: trade.p,
                timestamp: new Date(trade.t).toISOString(),
                data: trade,
              };
              this.listeners.forEach((listener) => listener(message));
            });
            return;
          }

          if (payload.type === "ping" || payload.type === "b" || payload.type === "status") {
            return;
          }

          if (payload.type === "error") {
            this.status = "error";
            this.notifyStatus();
            return;
          }
        } catch {
          // Ignore malformed payloads
        }
      };

      this.socket.onerror = () => {
        this.status = "error";
        this.notifyStatus();
      };

      this.socket.onclose = () => {
        this.status = "closed";
        this.notifyStatus();
        this.scheduleReconnect();
      };
    } catch {
      this.status = "error";
      this.notifyStatus();
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.status = "closed";
    this.notifyStatus();
  }

  subscribe(symbols: string[]) {
    const mappedSymbols = symbols.map((symbol) => FINNHUB_TICKER_MAP[symbol] || symbol);
    mappedSymbols.forEach((symbol) => this.pendingSubscriptions.add(symbol));
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    mappedSymbols.forEach((symbol) => this.sendSubscribe(symbol));
  }

  private sendSubscribe(symbol: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(JSON.stringify({ type: "subscribe", symbol }));
  }

  addMessageListener(listener: (message: MarketSocketMessage) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getStatus() {
    return this.status;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempts += 1;
      if (this.reconnectAttempts <= 5) {
        this.connect();
      }
    }, Math.min(3000 * this.reconnectAttempts + 1000, 10000));
  }

  private notifyStatus() {
    this.listeners.forEach((listener) => {
      listener({
        type: "STATUS_UPDATE",
        data: { status: this.status },
      });
    });
  }
}

export const marketSocket = new MarketSocketService();
