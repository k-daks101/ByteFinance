import React, { useState } from 'react';
import { getQuote, getBatchQuotes } from '../services/marketData';

/**
 * Test component to verify Alpha Vantage API integration
 * You can use this to test your API key
 */
export default function MarketDataTest() {
  const [symbol, setSymbol] = useState('AAPL');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [batchQuotes, setBatchQuotes] = useState([]);

  const testSingleQuote = async () => {
    setLoading(true);
    setError('');
    setQuote(null);
    
    try {
      const data = await getQuote(symbol);
      setQuote(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch quote');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testBatchQuotes = async () => {
    setLoading(true);
    setError('');
    setBatchQuotes([]);
    
    try {
      const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA'];
      const quotes = await getBatchQuotes(symbols);
      setBatchQuotes(quotes);
    } catch (err) {
      setError(err.message || 'Failed to fetch batch quotes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bf-card p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Market Data API Test</h2>
      
      {/* Single Quote Test */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-700">Test Single Quote</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter symbol (e.g., AAPL)"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
          <button
            onClick={testSingleQuote}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Quote'}
          </button>
        </div>
        
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            Error: {error}
          </div>
        )}
        
        {quote && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-semibold text-slate-900">{quote.symbol}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Price:</span>{' '}
                <span className="font-semibold">${quote.price?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500">Change:</span>{' '}
                <span className={`font-semibold ${
                  quote.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change?.toFixed(2)} ({quote.changePercent})
                </span>
              </div>
              <div>
                <span className="text-slate-500">Volume:</span>{' '}
                <span className="font-semibold">{quote.volume?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500">High:</span>{' '}
                <span className="font-semibold">${quote.high?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500">Low:</span>{' '}
                <span className="font-semibold">${quote.low?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500">Open:</span>{' '}
                <span className="font-semibold">${quote.open?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Quotes Test */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-700">Test Batch Quotes</h3>
        <button
          onClick={testBatchQuotes}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Batch Quotes (AAPL, TSLA, MSFT, NVDA)'}
        </button>
        
        {batchQuotes.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Batch Results:</h4>
            <div className="space-y-2">
              {batchQuotes.map((q) => (
                <div key={q.symbol} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{q.symbol}</span>
                  <span className="text-slate-600">${q.price?.toFixed(2)}</span>
                  <span className={`font-semibold ${
                    q.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {q.changePercent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        <strong>Note:</strong> Alpha Vantage free tier allows 5 API calls per minute. 
        If you see rate limit errors, wait a minute and try again.
      </div>
    </div>
  );
}
