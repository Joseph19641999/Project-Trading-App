import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataService } from 'src/app/services/api-services/data.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { StockDataDTO } from 'src/app/models/stock-data.DTO';
import { CustomerDTO } from 'src/app/models/customer.DTO';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit, OnDestroy {
  connectionSubscription: Subscription | undefined;
  paramSubscription: Subscription | undefined;

  assetData: StockDataDTO | null = null;
  userData: CustomerDTO | null = null;
  symbol: string | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private featureFlagService: FeatureFlagService
  ) {
    this.webSocketService.connect();
  }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe(params => {
      this.symbol = params.get('id');
      if (this.symbol) {
        this.loadStockData();
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
  }


  async loadStockData(): Promise<void> {
    try {
      if (this.symbol) {
        const assetData: any = await firstValueFrom(this.dataService.getStockFundamentalData(this.symbol));
        if (assetData) {
          this.assetData = assetData[0];
        } else {
          this.featureFlagService.log(1, 'Failed to load asset data.');
        }
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading asset data: ${error}`);
    }
  }
}
