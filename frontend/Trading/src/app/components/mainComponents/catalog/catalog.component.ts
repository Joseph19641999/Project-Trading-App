import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent{
  displayedColumns: string[] = ['symbol', 'companyName', 'price', 'changes', 'mktCap', 'action'];
  stocks: any[] = [];
  showStocks = true;
  
  view: number = 1;

  constructor(
    private webSocketService: WebSocketService,
    private router: Router,
    private featureFlagService: FeatureFlagService,
  ) {
    this.webSocketService.messages$.subscribe((data: any) => {
      this.featureFlagService.log(4, `Received data: ${JSON.stringify(data)}`);
      if (data && Array.isArray(data) && data.length && data[0].hasOwnProperty('name')) {
        this.stocks = data;
      }
    });
  }

  toggleDisplay(value: string) {
    if(value == "favourites"){
      this.view = 3;
    } else {
      this.view = 1;
    }

  }

  trade(element: any) {
    this.featureFlagService.log(3, `Trading: ${JSON.stringify(element)}`);
    this.router.navigate(['/asset', element.symbol]);
  }

  onSearch(value: string): void {
    this.featureFlagService.log(3, `Search initiated for: ${value}`);
    this.webSocketService.searchStock(value);
  }

  goToStockPage(stock: any): void {
    this.router.navigate(['/asset', stock.symbol]);
  }

  clearResults(): void {
    this.stocks = []; 
  }
}
