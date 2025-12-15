import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class JsonWorkerService {
  /**
 * The **`Worker`** interface of the Web Workers API represents a background task that can be created via script, 
 * which can send messages back to its creator.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker)
 * The **`postMessage()`** method of the Worker interface sends a message to the worker.
 */
  private worker?: Worker;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.worker = new Worker(
        new URL('../shared/json-parser.worker', import.meta.url),
        { type: 'module' }
      );
    }
  }

  parseLargeJson<T>(json: string): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject('Web Workers not supported');
        return;
      }

      this.worker.onmessage = ({ data }) => {
        data.success ? resolve(data.payload) : reject(data.error);
      };

      this.worker.onerror = err => reject(err.message);

      this.worker.postMessage(json);
    });
  }
}
