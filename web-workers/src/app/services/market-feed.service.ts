import { Injectable } from "@angular/core";
import { MarketTick } from "../models/market-tick";

@Injectable({ providedIn: 'root' })
export class MarketFeedService {
  start(cb: (tick: MarketTick) => void) {
    setInterval(() => {
      cb({
        price: 100 + Math.random() * 10,
        volume: Math.random() * 100,
        timestamp: Date.now()
      });
    }, 50); // 20 updates/sec
  }
}
