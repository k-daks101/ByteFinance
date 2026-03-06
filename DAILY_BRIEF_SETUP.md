# Daily AI Market Brief Setup Guide

## Problem Fixed! ✅

The Daily AI Market Brief was not showing data because the backend API wasn't responding. I've added **automatic fallback to demo data** so you'll always see content on the Dashboard.

## Current Status

- **Demo Mode Active**: The Dashboard now shows sample market data automatically
- **Visual Indicators**:
  - Amber dot = Demo data
  - Green dot = Live data from backend
  - Red dot = Backend unavailable
- **Help Banner**: Instructions appear when using demo data

## How to Enable LIVE Data

### Step 1: Start the Laravel Backend

```bash
cd "c:\Users\User\Desktop\CS - Year 2\Group Project\bytefinance-backend"
php artisan serve
```

The server should start on `http://127.0.0.1:8000`

### Step 2: Run Database Migrations

```bash
php artisan migrate
```

This creates the `daily_insights` table needed to store AI-generated briefings.

### Step 3: (Optional) Add OpenAI API Key

To get AI-generated insights instead of fallback text:

1. Open `bytefinance-backend/.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

**Without an API key**, the backend will return generic market insights (which is perfectly fine for development!)

## Testing It Works

1. Make sure Laravel backend is running
2. Go to Dashboard page
3. Click the "Refresh" button
4. Check the status indicator:
   - If it says "Live" with a green dot → ✅ Working!
   - If it says "Demo Mode" with amber dot → Backend not connected

## API Endpoint Details

- **Endpoint**: `GET /api/daily-brief`
- **Returns**:
  ```json
  {
    "id": 1,
    "insight_date": "2026-03-06",
    "summary_text": "Tech sector rallies...",
    "sentiment": "Bullish"
  }
  ```

## Troubleshooting

### "Demo Mode" Still Showing After Starting Backend

1. Check Laravel server is running: `http://127.0.0.1:8000`
2. Test the endpoint directly: `http://127.0.0.1:8000/api/daily-brief`
3. Check browser console (F12) for CORS errors
4. Verify bytefinance-backend/.env has correct CORS settings

### CORS Issues

If you see CORS errors in browser console, check `bytefinance-backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
```

### Database Issues

If you get database errors:

```bash
php artisan migrate:fresh
```

This will recreate all tables.

## What Changed in the Code

1. **Added Fallback Data**: Dashboard now shows demo data if API fails
2. **Better Error Handling**: Console logs show API errors for debugging
3. **Visual Status**: Color-coded status dot shows connection state
4. **Help Instructions**: Banner appears in demo mode to guide setup
5. **Colored Sentiment**: Bullish=green, Bearish=red, Neutral=gray

## Backend Controller Location

The backend logic is in:

- `bytefinance-backend/app/Http/Controllers/Api/MarketInsightController.php`
- `bytefinance-backend/app/Services/AiInsightService.php`

---

**Now your Dashboard shows data regardless of backend status!** 🎉
