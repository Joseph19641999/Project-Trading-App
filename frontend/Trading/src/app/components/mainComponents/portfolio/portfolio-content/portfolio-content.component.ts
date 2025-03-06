import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs'
import { firstValueFrom } from 'rxjs';
;
import { UserDataService } from 'src/app/services/api-services/user.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { AssetTableDTO } from 'src/app/models/asset-table.DTO';

interface HistoricalData {
  date: string;
  close: number;
}

interface PortfolioData {
  symbol: string;
  historicalData: HistoricalData[];
}

@Component({
  selector: 'app-portfolio-content',
  templateUrl: './portfolio-content.component.html',
  styleUrls: ['./portfolio-content.component.scss']
})
export class PortfolioContentComponent implements OnInit, OnDestroy {
  chart: Chart | undefined;
  userData: any | undefined;
  subscriptions: Subscription[] = [];
  stockData: PortfolioData[] = [];
  fundData: PortfolioData[] = [];
  fundTableData: AssetTableDTO[] = [];
  stockTableData: AssetTableDTO[] = [];

  @ViewChild('tabGroup') tabGroup: MatTabGroup | undefined;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(
    private httpClient: HttpClient,
    private userService: UserDataService,
    private featureFlagService: FeatureFlagService
  ) {
    Chart.register(...registerables);
  }
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private dev = 'http://localhost:3000';
  private apiUrl = this.dev;
  async ngOnInit() {
    try {
      this.userData = await this.userService.getUserData();
      await this.loadStockData();
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing component: ${error}`);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onTabChange(event: any): void {
    const tabIndex = event.index;
    if (tabIndex === 0) {
      this.loadStockData();
    } else if (tabIndex === 1) {
      this.loadFundData();
    }
  }

  async loadStockData() {
    const url = `${this.apiUrl}/user/${this.userData.id}/portfolios/historical/stock`;
    try {
      const data: PortfolioData[] = await firstValueFrom(this.httpClient.get<PortfolioData[]>(url));
      this.stockData = data;
      this.updateChart('Stock Prices');
    } catch (error) {
      this.featureFlagService.log(1, `Error fetching stock data: ${error}`);
    }
  }

  async loadFundData() {
    const url = `${this.apiUrl}/user/${this.userData.id}/portfolios/historical/fund`;
    try {
      const data: PortfolioData[] = await firstValueFrom(this.httpClient.get<PortfolioData[]>(url));
      this.fundData = data;
      this.updateChart('Fund Prices');
    } catch (error) {
      this.featureFlagService.log(1, `Error fetching fund data: ${error}`);
    }
  }

  updateChart(label: string) {
    if (!this.canvas || !this.canvas.nativeElement) {
      this.featureFlagService.log(1, 'Canvas element is not available.');
      return;
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      this.featureFlagService.log(1, 'Failed to get 2D context');
      return;
    }

    const data = label === 'Stock Prices' ? this.stockData : this.fundData;
    const labelsSet = new Set<string>();
    const dataMap: { [date: string]: number[] } = {};

    data.forEach(item => {
      item.historicalData.forEach(hd => {
        labelsSet.add(hd.date);
        if (!dataMap[hd.date]) {
          dataMap[hd.date] = [];
        }
        dataMap[hd.date].push(hd.close);
      });
    });

    const labels = Array.from(labelsSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const datasets = data.map(item => ({
      label: `${label} - ${item.symbol}`,
      data: labels.map(date => {
        const index = item.historicalData.findIndex(hd => hd.date === date);
        return index !== -1 ? item.historicalData[index].close : null;
      }),
      borderColor: this.getRandomColor(),
      borderWidth: 2,
      fill: false,
      tension: 0.4
    }));

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category'
          },
          y: {
            type: 'linear',
            beginAtZero: true
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }).map(() => letters[Math.floor(Math.random() * 16)]).join('')}`;
  }
}
