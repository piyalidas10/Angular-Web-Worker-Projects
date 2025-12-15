import { Component, Inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { Product, ProductFilterCriteria } from '../models/product.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnDestroy {
  private worker?: Worker;

  products: Product[] = this.generateProducts();


  filteredProducts = signal<Product[]>(this.products);


  criteria: ProductFilterCriteria = {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 100000
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.worker = new Worker(
        new URL('../shared/product-filter.worker', import.meta.url),
        { type: 'module' }
      );
    }

    if (this.worker) {
      this.worker.onmessage = ({ data }) => {
        this.filteredProducts.set(data);
      };
    }

    this.runFilter();
  }


  onSearch(event: Event) {
    this.criteria.search = (event.target as HTMLInputElement).value;
    this.runFilter();
  }


  onCategory(event: Event) {
    this.criteria.category = (event.target as HTMLSelectElement).value;
    this.runFilter();
  }


  runFilter() {
    if (!this.worker) {
      // SSR fallback – filter on main thread
      const filtered = this.products.filter(p => p.name.toLowerCase().includes(this.criteria.search.toLowerCase()));
      this.filteredProducts.set(filtered);
      return;
    }

    this.worker!.postMessage({
      products: this.products,
      criteria: this.criteria
    });
  }


  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
    }
  }


  private generateProducts(): Product[] {
    return Array.from({ length: 20000 }).map((_, i) => ({
      id: i,
      name: `Product ${i}`,
      category: i % 2 === 0 ? 'Electronics' : 'Books',
      price: Math.floor(Math.random() * 10000)
    }));
  }
}
