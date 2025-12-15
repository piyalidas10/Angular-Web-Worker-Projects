import { Component, inject, OnInit } from '@angular/core';
import { MarketFeedService } from '../services/market-feed.service';
import { MarketWorkerService } from '../services/market-worker.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss'
})
export class MarketDashboardComponent implements OnInit {
  vwap = 0;
  high = 0;
  low = 0;
  changePct = 0;

  private feed: MarketFeedService = inject(MarketFeedService);
  private worker: MarketWorkerService = inject(MarketWorkerService);

  ngOnInit() {
    this.worker.onUpdate(data => {
      this.vwap = data.vwap;
      this.high = data.high;
      this.low = data.low;
      this.changePct = data.changePct;
    });

    this.feed.start(tick => this.worker.sendTick(tick));
  }
}
