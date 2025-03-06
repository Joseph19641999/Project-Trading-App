import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as ApexCharts from 'apexcharts';

import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { StockHistoryDTO } from 'src/app/models/stock-history.DTO';



@Component({
  selector: 'app-asset-chart',
  templateUrl: './asset-chart.component.html',
  styleUrls: ['./asset-chart.component.scss']
})
export class AssetChartComponent implements OnInit, OnChanges {
  @Input() historicalData: StockHistoryDTO[] = [];
  public chartData: any[] = [];

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit(): void {
    if (this.historicalData.length) {
      this.updateChartData(this.historicalData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["historicalData"] && !changes["historicalData"].firstChange) {
      this.updateChartData(this.historicalData);
    }
  }


  
  updateChartData(data: StockHistoryDTO[]): void {
    try {
      this.chartData = data.map(item => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      })).reverse();
      this.featureFlagService.log(4, `Chart data updated: ${JSON.stringify(this.chartData)}`);
    } catch (error) {
      this.featureFlagService.log(1, `Error updating chart data: ${error}`);
    }
  }
}
