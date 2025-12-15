import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MarketTick } from "../models/market-tick";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class MarketWorkerService {
  private worker?: Worker;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.worker = new Worker(
        new URL('../shared/market.worker', import.meta.url),
        { type: 'module' }
      );
    }
  }

  onUpdate(cb: (data: any) => void) {
    if (!this.worker) {
      return;
    }
    this.worker.onmessage = ({ data }) => cb(data);
  }

  sendTick(tick: MarketTick) {
    if (!this.worker) {
      return;
    }
    this.worker.postMessage({
      type: 'TICK',
      payload: tick
    });
  }
}
