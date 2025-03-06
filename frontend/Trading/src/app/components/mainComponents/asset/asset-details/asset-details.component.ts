import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';

import { DataService } from 'src/app/services/api-services/data.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { StockHistoryDTO } from 'src/app/models/stock-history.DTO';
import { StockDataDTO } from 'src/app/models/stock-data.DTO';


@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
  @Input() assetData: StockDataDTO | null = null;

  currentDate = new Date();
  historicalData: StockHistoryDTO[] = [];
  connectionSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.loadStockHistory();
  }

  ngOnDestroy(): void {
    this.connectionSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['assetData'] &&
      !changes['assetData'].firstChange &&
      changes['assetData'].currentValue
    ) {
      this.loadStockHistory();
    }
  }




  transformCapital(data: any): any {
    try {
      if (data && typeof data === 'number') {
        if (data >= 1e9) {
          data = parseFloat((data / 1e9).toFixed(2)) + ' Mrd.';
        } else if (data >= 1e6) {
          data = parseFloat((data / 1e6).toFixed(2)) + ' Mil.';
        } else if (data >= 1e3) {
          data = parseFloat((data / 1e3).toFixed(2)) + ' Tsd.';
        }
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error transforming fundamental data: ${error}`);
    }
    return data;
  }



  async loadStockHistory(): Promise<void> {
    try {
      if (this.assetData) {
        this.featureFlagService.log(3, `Loading historical data for symbol: ${this.assetData.symbol}`);

        const historicalData = await firstValueFrom(this.dataService.getStockHistoricalData(this.assetData?.symbol));

        if (historicalData) {
          this.historicalData = historicalData;
          this.featureFlagService.log(4, `Historical data loaded: ${JSON.stringify(historicalData)}`);

        } else {
          this.featureFlagService.log(2, 'Failed to load historical data.');
        }
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error fetching historical data: ${error}`);
    }
  }

  isNumber(value: any): boolean {
    return !isNaN(value);
  }
}
