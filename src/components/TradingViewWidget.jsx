import React, { useEffect, useRef, memo } from 'react';

let tvScriptLoadingPromise;

function TradingViewWidget({ symbol }) {
  const onLoadScriptRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => {
      onLoadScriptRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };

    function createWidget() {
      if (containerRef.current && window.TradingView) {
        containerRef.current.innerHTML = "";
        const widgetId = `tv_${Math.random().toString(36).substring(7)}`;
        containerRef.current.id = widgetId;

        new window.TradingView.widget({
          autosize: true,
          symbol: symbol || "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1", // Candle chart
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: false,
          hide_top_toolbar: true,
          hide_legend: true,
          save_image: false,
          container_id: widgetId,
        });
      }
    }
  }, [symbol]);

  return (
    <div className='tradingview-widget-container' style={{ height: "100%", width: "100%", minHeight: "350px" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

export default memo(TradingViewWidget);
