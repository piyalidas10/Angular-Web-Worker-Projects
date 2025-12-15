/// <reference lib="webworker" />

import { MarketTick } from "../models/market-tick";

let ticks: MarketTick[] = [];

addEventListener('message', ({ data }) => {
  if (data.type === 'TICK') {
    ticks.push(data.payload);

    // Keep last N ticks (sliding window)
    if (ticks.length > 10_000) {
      ticks.shift();
    }

    // 🔥 Heavy calculations
    let totalVolume = 0;
    let vwapNumerator = 0;
    let high = -Infinity;
    let low = Infinity;

    for (let i = 0; i < ticks.length; i++) {
      const t = ticks[i];

      totalVolume += t.volume;
      vwapNumerator += t.price * t.volume;

      if (t.price > high) high = t.price;
      if (t.price < low) low = t.price;
    }

    const vwap = totalVolume ? vwapNumerator / totalVolume : 0;
    const lastPrice = ticks[ticks.length - 1].price;
    const firstPrice = ticks[0].price;

    postMessage({
      vwap,
      high,
      low,
      changePct: ((lastPrice - firstPrice) / firstPrice) * 100
    });
  }
});
