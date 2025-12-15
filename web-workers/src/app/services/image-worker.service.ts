import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ImageWorkerService {
  private worker?: Worker;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
        this.worker = new Worker(
        new URL('../shared/image.worker', import.meta.url),
        { type: 'module' }
        );
    }
  }

  process(imageData: ImageData): Promise<ImageData> {
    // ✅ SSR / non-browser guard
    if (!this.worker) {
      // fallback: return original or process on main thread
      return Promise.resolve(imageData);
    }

    return new Promise<ImageData>((resolve) => {
      this.worker!.onmessage = ({ data }) => {
        resolve(data.imageData);
      };

      this.worker!.postMessage(
        {
          imageData,
          width: imageData.width,
          height: imageData.height
        },
        [imageData.data.buffer] // transferable
      );
    });
  }
}
