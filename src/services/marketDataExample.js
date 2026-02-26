/**
 * Example: How to integrate real-time market data into your pages
 * 
 * This file shows examples of using the marketData service
 */

import { getQuote, getBatchQuotes, getHistoricalData } from './marketData';

/**
 * Example 1: Update Market.jsx to use real-time data
 */
export const updateMarketPageExample = async (setInstruments, setLoading) => {
  try {
    setLoading(true);
    
    // Popular stocks to display
    const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'];
    
    // Fetch real-time quotes for all symbols
    const quotes = await getBatchQuotes(symbols);
    
    // Transform to match your component's expected format
    const instruments = quotes.map(quote => ({
      id: quote.symbol,
      symbol: quote.symbol,
      name: quote.symbol, // You might want to fetch company names separately
      price: `$${quote.price.toFixed(2)}`,
      change: quote.changePercent,
      volume: quote.volume ? formatVolume(quote.volume) : 'N/A',
    }));
    
    setInstruments(instruments);
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to your backend API if third-party fails
    // const data = await api.get('/instruments');
  } finally {
    setLoading(false);
  }
};

/**
 * Example 2: Update Trade.jsx watchlist with real-time prices
 */
export const updateWatchlistExample = async (symbols, setWatchlist) => {
  try {
    const quotes = await getBatchQuotes(symbols);
    
    const watchlist = quotes.map(quote => ({
      name: quote.symbol, // Add company name lookup if needed
      symbol: quote.symbol,
      price: quote.price.toFixed(2),
      change: quote.changePercent,
      volume: formatVolume(quote.volume),
      trend: quote.change >= 0 ? 'up' : 'down',
    }));
    
    setWatchlist(watchlist);
  } catch (error) {
    console.error('Error updating watchlist:', error);
  }
};

/**
 * Example 3: Get single stock quote for Trade form
 */
export const getStockQuoteExample = async (symbol) => {
  try {
    const quote = await getQuote(symbol);
    return {
      symbol: quote.symbol,
      currentPrice: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
};

/**
 * Example 4: Get historical data for charts
 */
export const getChartDataExample = async (symbol) => {
  try {
    const historicalData = await getHistoricalData(symbol, 'daily');
    
    // Transform to chart format
    const chartData = Object.entries(historicalData).map(([date, data]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    }));
    
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

/**
 * Helper: Format volume numbers
 */
const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

/**
 * Example 5: Hybrid approach - Use backend API with fallback to third-party
 */
export const getInstrumentsHybrid = async (api) => {
  try {
    // Try backend API first
    const data = await api.get('/instruments');
    return data;
  } catch (error) {
    console.warn('Backend API failed, using third-party:', error);
    
    // Fallback to third-party API
    const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL'];
    const quotes = await getBatchQuotes(symbols);
    
    return quotes.map(q => ({
      id: q.symbol,
      symbol: q.symbol,
      name: q.symbol,
      price: q.price.toFixed(2),
    }));
  }
};
