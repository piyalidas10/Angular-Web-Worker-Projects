import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ImageWorkerService } from '../services/image-worker.service';

@Component({
  selector: 'app-image-processor',
  standalone: true,
  imports: [],
  templateUrl: './image-processor.component.html',
  styleUrl: './image-processor.component.scss'
})
export class ImageProcessorComponent {
@ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
private worker: ImageWorkerService = inject(ImageWorkerService);

  async load(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const ctx = this.canvas.nativeElement.getContext('2d')!;
      this.canvas.nativeElement.width = img.width;
      this.canvas.nativeElement.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const processed = await this.worker.process(imageData);

      ctx.putImageData(processed, 0, 0);
    };
  }
}
