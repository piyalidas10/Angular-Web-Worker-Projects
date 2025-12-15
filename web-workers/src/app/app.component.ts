import { Component, inject, signal } from '@angular/core';
import { JsonWorkerService } from './services/json-worker.service';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { MarketDashboardComponent } from './market-dashboard/market-dashboard.component';
import { ImageProcessorComponent } from './image-processor/image-processor.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-root',  
  standalone: true,
  imports: [JsonPipe, MarketDashboardComponent, ImageProcessorComponent, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading = signal(false);
  data = signal<any>(null);
  private http: HttpClient = inject(HttpClient);
  private jsonWorker: JsonWorkerService = inject(JsonWorkerService);

  load() {
    this.loading.set(true);

    this.http
      .get('assets/huge.json', { responseType: 'text' })
      .subscribe(async jsonText => {
        const parsed = await this.jsonWorker.parseLargeJson(jsonText);
        this.data.set(parsed);
        this.loading.set(false);
      });
  }

}
