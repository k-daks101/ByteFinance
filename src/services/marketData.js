import { api } from './api';

/**
 * Market Data Service
 * Integrates with third-party financial data APIs for real-time market data
 */

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// IEX Cloud API configuration
const IEX_API_KEY = import.meta.env.VITE_IEX_API_KEY || '';
const IEX_BASE_URL = 'https://cloud.iexapis.com/stable';

// Finnhub API configuration
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

/**
 * Get real-time quote using Alpha Vantage
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @returns {Promise<Object>} Quote data
 */
export const getAlphaVantageQuote = async (symbol) => {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key not configured');
  }

  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API rate limit exceeded');
    }

    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
    };
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    throw error;
  }
};

/**
 * Get real-time quote using IEX Cloud
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
export const getIEXQuote = async (symbol) => {
  if (!IEX_API_KEY) {
    throw new Error('IEX Cloud API key not configured');
  }

  try {
    const response = await fetch(
      `${IEX_BASE_URL}/stock/${symbol}/quote?token=${IEX_API_KEY}`
    );
    const data = await response.json();
    
    return {
      symbol: data.symbol,
      price: data.latestPrice,
      change: data.change,
      changePercent: `${data.changePercent ? (data.changePercent * 100).toFixed(2) : 0}%`,
      volume: data.volume,
      high: data.high,
      low: data.low,
      open: data.open,
      previousClose: data.previousClose,
    };
  } catch (error) {
    console.error('IEX Cloud API error:', error);
    throw error;
  }
};

/**
 * Get real-time quote using Finnhub
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
export const getFinnhubQuote = async (symbol) => {
  if (!FINNHUB_API_KEY) {
    throw new Error('Finnhub API key not configured');
  }

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    return {
      symbol: symbol,
      price: data.c,
      change: data.d,
      changePercent: `${data.dp ? data.dp.toFixed(2) : 0}%`,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
    };
  } catch (error) {
    console.error('Finnhub API error:', error);
    throw error;
  }
};

/**
 * Get multiple quotes at once (batch request)
 * @param {string[]} symbols - Array of stock symbols
 * @param {string} provider - 'alphavantage', 'iex', or 'finnhub'
 * @returns {Promise<Object[]>} Array of quote data
 */
export const getBatchQuotes = async (symbols, provider = 'alphavantage') => {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        switch (provider) {
          case 'iex':
            return await getIEXQuote(symbol);
          case 'finnhub':
            return await getFinnhubQuote(symbol);
          case 'alphavantage':
          default:
            return await getAlphaVantageQuote(symbol);
        }
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
      }
    })
  );

  return quotes.filter(quote => quote !== null);
};

/**
 * Get historical data (for charts)
 * @param {string} symbol - Stock symbol
 * @param {string} interval - '1min', '5min', '15min', '30min', '60min', 'daily'
 * @param {string} provider - API provider to use
 * @returns {Promise<Object>} Historical data
 */
export const getHistoricalData = async (symbol, interval = 'daily', provider = 'alphavantage') => {
  if (provider === 'alphavantage' && ALPHA_VANTAGE_API_KEY) {
    const functionName = interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY';
    const url = interval === 'daily'
      ? `${ALPHA_VANTAGE_BASE_URL}?function=${functionName}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      : `${ALPHA_VANTAGE_BASE_URL}?function=${functionName}&symbol=${symbol}&interval=${interval}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API rate limit exceeded');
    }

    const timeSeriesKey = interval === 'daily' 
      ? 'Time Series (Daily)'
      : `Time Series (${interval})`;
    
    return data[timeSeriesKey] || {};
  }

  // Fallback: return empty data
  return {};
};

/**
 * Unified function to get quote (tries multiple providers)
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
export const getQuote = async (symbol) => {
  // Try providers in order of preference
  const providers = [
    { name: 'iex', fn: getIEXQuote },
    { name: 'finnhub', fn: getFinnhubQuote },
    { name: 'alphavantage', fn: getAlphaVantageQuote },
  ];

  for (const provider of providers) {
    try {
      if (provider.name === 'iex' && IEX_API_KEY) {
        return await provider.fn(symbol);
      }
      if (provider.name === 'finnhub' && FINNHUB_API_KEY) {
        return await provider.fn(symbol);
      }
      if (provider.name === 'alphavantage' && ALPHA_VANTAGE_API_KEY) {
        return await provider.fn(symbol);
      }
    } catch (error) {
      console.warn(`${provider.name} failed, trying next provider...`);
      continue;
    }
  }

  throw new Error('No market data provider available');
};

export default {
  getQuote,
  getBatchQuotes,
  getHistoricalData,
  getAlphaVantageQuote,
  getIEXQuote,
  getFinnhubQuote,
};
