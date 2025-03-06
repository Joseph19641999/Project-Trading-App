import { Component } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { Router } from '@angular/router';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  stocks: any[] = [];

  constructor(private webSocketService: WebSocketService, private router: Router, private featureFlagService: FeatureFlagService) {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.webSocketService.messages$.subscribe((data: any) => {
      if (data && Array.isArray(data) && data.length && data[0].hasOwnProperty('name')) {
        this.stocks = data;
        this.featureFlagService.log(3, `Received data: ${JSON.stringify(data)}`);
      }
    });
  }

  onSearch(value: string): void {
    this.webSocketService.searchStock(value);
  }

  goToStockPage(stock: any): void {
    this.router.navigate(['/stock', stock.symbol]);
  }
}
