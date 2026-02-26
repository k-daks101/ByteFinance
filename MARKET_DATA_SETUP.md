# Market Data API Setup Guide

This guide explains how to integrate real-time financial market data into ByteFinance using third-party APIs.

## Available Providers

### 1. Alpha Vantage (Recommended for Free Tier)
- **Free Tier**: 5 API calls/minute, 500 calls/day
- **Features**: Real-time quotes, historical data, intraday data
- **Sign Up**: https://www.alphavantage.co/support/#api-key
- **Best For**: Educational projects, low-volume applications

### 2. IEX Cloud
- **Free Tier**: 50,000 messages/month
- **Features**: Real-time quotes, WebSocket streaming, historical data
- **Sign Up**: https://iexcloud.io/console/
- **Best For**: Real-time data, WebSocket streaming

### 3. Finnhub
- **Free Tier**: 60 API calls/minute
- **Features**: Real-time quotes, news, company data
- **Sign Up**: https://finnhub.io/register
- **Best For**: News integration, company fundamentals

## Setup Instructions

### Step 1: Get API Keys

1. **Alpha Vantage**:
   - Visit https://www.alphavantage.co/support/#api-key
   - Enter your email address
   - Copy the API key from your email

2. **IEX Cloud** (Optional):
   - Visit https://iexcloud.io/console/
   - Sign up for a free account
   - Copy your API token from the dashboard

3. **Finnhub** (Optional):
   - Visit https://finnhub.io/register
   - Sign up for a free account
   - Copy your API key from the dashboard

### Step 2: Configure Environment Variables

Add your API keys to the `.env` file:

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
VITE_IEX_API_KEY=your_iex_key_here
VITE_FINNHUB_API_KEY=your_finnhub_key_here
```

**Important**: Restart your development server after adding API keys!

### Step 3: Use in Your Code

The `marketData.js` service automatically tries providers in order of preference:

```javascript
import { getQuote, getBatchQuotes } from '../services/marketData';

// Get a single quote
const quote = await getQuote('AAPL');
console.log(quote.price, quote.changePercent);

// Get multiple quotes at once
const quotes = await getBatchQuotes(['AAPL', 'TSLA', 'MSFT']);
```

## Integration with Backend

You have two options:

### Option 1: Frontend Direct Access (Current Setup)
- Frontend calls third-party APIs directly
- Pros: Simple, no backend changes needed
- Cons: API keys exposed in frontend (use environment variables)

### Option 2: Backend Proxy (Recommended for Production)
- Frontend calls your backend API
- Backend calls third-party APIs
- Pros: API keys hidden, better rate limiting, caching
- Cons: Requires backend changes

## Rate Limiting

**Alpha Vantage**: 
- Free tier: 5 calls/minute
- Use `setTimeout` or debouncing to avoid exceeding limits

**IEX Cloud**:
- Free tier: 50,000 messages/month
- More generous limits

**Finnhub**:
- Free tier: 60 calls/minute
- Good for frequent updates

## Example: Update Market Page

```javascript
import { getBatchQuotes } from '../services/marketData';

useEffect(() => {
  const fetchRealTimeData = async () => {
    const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA'];
    const quotes = await getBatchQuotes(symbols);
    setInstruments(quotes.map(q => ({
      symbol: q.symbol,
      name: q.symbol, // You might want to fetch company names separately
      price: q.price.toFixed(2),
      change: q.changePercent,
    })));
  };

  fetchRealTimeData();
  const interval = setInterval(fetchRealTimeData, 60000); // Update every minute
  return () => clearInterval(interval);
}, []);
```

## WebSocket for Real-Time Updates

For true real-time updates (without polling), consider:

1. **IEX Cloud WebSocket**: https://iexcloud.io/docs/api/#websockets
2. **Finnhub WebSocket**: https://finnhub.io/docs/api#websocket-price

Example WebSocket integration:

```javascript
// IEX Cloud WebSocket example
const ws = new WebSocket(`wss://ws-api.iextrading.com/1.0/tops?token=${IEX_API_KEY}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update prices in real-time
  updatePrice(data.symbol, data.lastSalePrice);
};
```

## Cost Considerations

- **Free tiers** are sufficient for development and small projects
- **Paid tiers** start around $20-50/month for higher limits
- Consider caching data to reduce API calls
- Use WebSockets instead of polling when possible

## Security Notes

⚠️ **Important**: Never commit API keys to version control!

- Use `.env` file (already in `.gitignore`)
- For production, use environment variables on your hosting platform
- Consider using a backend proxy to hide API keys

## Troubleshooting

**"API rate limit exceeded"**:
- Reduce polling frequency
- Implement caching
- Use multiple API keys (rotate them)
- Upgrade to paid tier

**"API key not configured"**:
- Check `.env` file has the key
- Restart development server
- Check key is correct (no extra spaces)

**CORS errors**:
- Some APIs require backend proxy
- Check API provider documentation

## Next Steps

1. Get at least one API key (Alpha Vantage recommended)
2. Add it to `.env` file
3. Test with `getQuote('AAPL')` in browser console
4. Integrate into Market.jsx and Trade.jsx pages
5. Consider backend proxy for production
