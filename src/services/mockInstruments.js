/**
 * Mock instruments with realistic base prices.
 * Used as fallback when the backend is unavailable or returns empty data.
 */
export const MOCK_INSTRUMENTS = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    sector: "Technology",
    description: "Consumer electronics, software, and online services.",
    current_price: 189.30,
    previous_price: 185.20,
  },
  {
    id: 2,
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "stock",
    sector: "Automotive",
    description: "Electric vehicles and clean energy products.",
    current_price: 172.50,
    previous_price: 180.00,
  },
  {
    id: 3,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "stock",
    sector: "Technology",
    description: "Cloud computing, software, and gaming.",
    current_price: 415.20,
    previous_price: 410.80,
  },
  {
    id: 4,
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "stock",
    sector: "Semiconductors",
    description: "Graphics processing units and AI acceleration chips.",
    current_price: 875.40,
    previous_price: 840.00,
  },
  {
    id: 5,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    sector: "Technology",
    description: "Search engine, cloud, and digital advertising.",
    current_price: 172.80,
    previous_price: 170.50,
  },
  {
    id: 6,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "stock",
    sector: "Consumer Discretionary",
    description: "E-commerce and cloud computing services.",
    current_price: 188.60,
    previous_price: 185.90,
  },
  {
    id: 7,
    symbol: "META",
    name: "Meta Platforms Inc.",
    type: "stock",
    sector: "Communication Services",
    description: "Social media and virtual reality platforms.",
    current_price: 492.30,
    previous_price: 502.10,
  },
  {
    id: 8,
    symbol: "NFLX",
    name: "Netflix Inc.",
    type: "stock",
    sector: "Communication Services",
    description: "Global streaming entertainment platform.",
    current_price: 628.70,
    previous_price: 615.00,
  },
  {
    id: 9,
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    sector: "Cryptocurrency",
    description: "The original decentralised digital currency.",
    current_price: 67420.00,
    previous_price: 66100.00,
  },
  {
    id: 10,
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    sector: "Cryptocurrency",
    description: "Smart contract platform and decentralised apps.",
    current_price: 3285.50,
    previous_price: 3190.00,
  },
  {
    id: 11,
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    type: "forex",
    sector: "Foreign Exchange",
    description: "Exchange rate between the British Pound and US Dollar.",
    current_price: 1.2720,
    previous_price: 1.2680,
  },
  {
    id: 12,
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    type: "forex",
    sector: "Foreign Exchange",
    description: "Exchange rate between the Euro and US Dollar.",
    current_price: 1.0845,
    previous_price: 1.0810,
  },
];

// Volatility per type (max % swing per tick)
const VOLATILITY = { crypto: 2.0, stock: 0.7, forex: 0.12 };

// Drift bias per symbol (slight trend)
const TRENDS = {
  NVDA: 0.15, MSFT: 0.10, GOOGL: 0.05, AAPL: 0.08,
  AMZN: 0.07, META: -0.03, NFLX: 0.04, TSLA: -0.12,
  BTC: 0.20, ETH: 0.15, "GBP/USD": 0.02, "EUR/USD": -0.01,
};

/**
 * Apply a single price tick to a list of instruments.
 * Returns a new array with updated prices — does not mutate the original.
 */
export function simulatePriceTick(instruments) {
  return instruments.map((inst) => {
    const maxSwing = VOLATILITY[inst.type] ?? 0.7;
    const drift    = TRENDS[inst.symbol] ?? 0;
    const random   = ((Math.random() * 2 - 1) * maxSwing);          // ±maxSwing%
    const change   = (random + drift / 100) / 100;                  // as fraction
    const newPrice = Math.max(inst.current_price * (1 + change), 0.0001);

    const rounded =
      newPrice >= 100  ? Math.round(newPrice * 100) / 100 :
      newPrice >= 1    ? Math.round(newPrice * 10000) / 10000 :
                         Math.round(newPrice * 1000000) / 1000000;

    const changePct = inst.current_price > 0
      ? +((rounded - inst.previous_price) / inst.previous_price * 100).toFixed(2)
      : 0;

    return {
      ...inst,
      previous_price: inst.current_price,
      current_price:  rounded,
      change:         +(rounded - inst.previous_price).toFixed(4),
      change_percent: changePct,
    };
  });
}

/**
 * Enrich a raw instruments array (from backend or mock) with
 * change / change_percent if they are missing.
 */
export function enrichInstruments(instruments) {
  return instruments.map((inst) => ({
    ...inst,
    change: inst.change ?? +(inst.current_price - (inst.previous_price ?? inst.current_price)).toFixed(4),
    change_percent: inst.change_percent ??
      (inst.previous_price && inst.previous_price !== 0
        ? +((inst.current_price - inst.previous_price) / inst.previous_price * 100).toFixed(2)
        : 0),
  }));
}
