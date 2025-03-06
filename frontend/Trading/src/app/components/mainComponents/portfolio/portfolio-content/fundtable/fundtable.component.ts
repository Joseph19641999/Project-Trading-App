import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as ApexCharts from 'apexcharts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';
import { DataService } from 'src/app/services/api-services/data.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service'
import { PortfolioService } from 'src/app/services/api-services/portfolio.service';
import { UserDataService } from 'src/app/services/api-services/user.service';

import { CheckoutBuyComponent } from '../../../checkout/checkout-buy/checkout-buy.component';
import { CheckoutSellComponent } from '../../../checkout/checkout-sell/checkout-sell.component';

import { AssetTableDTO } from 'src/app/models/asset-table.DTO';
import { StockDataDTO } from 'src/app/models/stock-data.DTO';




@Component({
  selector: 'app-fundtable',
  templateUrl: './fundtable.component.html',
  styleUrls: ['./fundtable.component.scss'],
})
export class FundtableComponent implements OnInit {
  userData: any | undefined;
  popup: MatDialogRef<any> | null = null;
  fundData: MatTableDataSource<AssetTableDTO> = new MatTableDataSource<AssetTableDTO>([]);
  displayedColumns: string[] = [
    'aktienFondsName',
    'menge',
    'eintiegkurs',
    'einzelwert',
    'gesamtwert',
    'rendite',
    'rendite_in_procent',
    'buy',
    'sell',
  ];

  private donutChart: ApexCharts | null = null;

  @ViewChild('donutChart', { static: true }) donutChartElement!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserDataService,
    private portService: PortfolioService,
    private WinDialog: MatDialog,
    private dataService: DataService,
    private dialog: DialogService,
    private router: Router,
    private featureFlagService: FeatureFlagService
  ) {}

  async ngOnInit() {
    try {
      this.userData = await this.userService.getUserData();
      await this.loadFundInfo();
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing component: ${error}`);
    }
  }

  ngAfterViewInit() {
    this.fundData.paginator = this.paginator;
    this.fundData.sort = this.sort;
  }

  async loadFundInfo() {
    try {
      const data: AssetTableDTO[] = await firstValueFrom(this.portService.getFundPortfolio());
      this.fundData.data = data;
      this.featureFlagService.log(3, 'Fund Data loaded successfully');
      this.initializeCharts();
      this.loadRendite();
    } catch (error) {
      this.featureFlagService.log(1, `Error loading fund information: ${error}`);
    }
  }

  async initializeCharts(){
    if (!this.donutChartElement) {
      this.featureFlagService.log(1, 'Donut chart element not found!');
      return;
    }

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    const chartData = this.fundData.data.map(item => ({
      name: item.aktienFondsName,
      value: parseFloat(item.gesamtwert.toString())
    })).filter(item => !isNaN(item.value));

    if (chartData.length === 0) {
      this.featureFlagService.log(1, 'No valid data for the chart');
      return;
    }

    const options = {
      series: chartData.map(item => item.value),
      chart: {
        type: 'donut',
        height: 200
      },
      labels: chartData.map(item => item.name),
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 150
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    try {
      this.donutChart = new ApexCharts(this.donutChartElement.nativeElement, options);
      this.donutChart.render();
    } catch (error) {
      this.featureFlagService.log(1, `Error rendering chart: ${error}`);
    }
  }

  setLabelValues(gesamtwert: number, rendit: number) {
    const gesamtwertLabel = this.el.nativeElement.querySelector('#gesamtwerte_label');
    const renditLabel = this.el.nativeElement.querySelector('#rendit_label');

    if (gesamtwertLabel) {
      this.renderer.setProperty(
        gesamtwertLabel,
        'textContent',
        gesamtwert ? gesamtwert.toFixed(2) : '0.00'
      );
    }
    if (renditLabel) {
      this.renderer.setProperty(
        renditLabel,
        'textContent',
        rendit ? rendit.toFixed(2) : '0.00'
      );
      this.renderer.setStyle(
        renditLabel,
        'color',
        rendit >= 0 ? 'green' : 'red'
      );
    }
  }

  async loadRendite() {
    try {
      const data: any = await firstValueFrom(this.portService.getRenditeFund());
      if (data) {
        this.featureFlagService.log(3, 'Rendite Data loaded successfully');
        this.setLabelValues(data.gesamtwert, data.rendit);
      } else {
        this.featureFlagService.log(2, 'No rendite data received');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading Rendite: ${error}`);
    }
  }



  routeAsset(stock: AssetTableDTO) {
    this.router.navigate([`/asset/${stock.aktienFondsSymbol}`]);
  }

  loadDialogData(symbol: string): Observable<StockDataDTO | null> {
    return this.dataService.getStockFundamentalData(symbol).pipe(
      map(data => {
        if (data) {
          this.featureFlagService.log(3, `Fundamental data received: ${JSON.stringify(data)}`);
          return data;
        } else {
          this.featureFlagService.log(2, `No fundamental data received for symbol: ${symbol}`);
          return null;
        }
      }),
      catchError(error => {
        this.featureFlagService.log(1, `Error loading dialog data: ${error}`);
        return of(null);
      })
    );
  }




  async openBuyDialog(stock: AssetTableDTO) {
    try {
      const data: any = await lastValueFrom(this.loadDialogData(stock.aktienFondsSymbol));
      if (data[0]) {
        this.popup = this.WinDialog.open(CheckoutBuyComponent, {
          disableClose: true,
          data: { Data: data[0] }
        });

        this.popup.afterClosed().subscribe(async () => {
          await this.loadFundInfo();
          this.featureFlagService.log(3, 'Buy window closed.');
        });
      } else {
        this.dataErrorDialog();
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error opening buy dialog: ${error}`);
      this.dataErrorDialog();
    }
  }

  async openSellDialog(stock: AssetTableDTO) {
    try {
      const data :any = await lastValueFrom(this.loadDialogData(stock.aktienFondsSymbol));
      if (data[0]) {
        this.popup = this.WinDialog.open(CheckoutSellComponent, {
          disableClose: true,
          data: { Data: data[0] }
        });

        this.popup.afterClosed().subscribe(async () => {
          await this.loadFundInfo();
          this.featureFlagService.log(3, 'Sell window closed.');
        });
      } else {
        this.dataErrorDialog();
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error opening sell dialog: ${error}`);
      this.dataErrorDialog();
    }
  }







  dataErrorDialog() {
    this.dialog.openDialog(
      'Datenübertragungsfehler!',
      'Es tut uns leid, es gab einen Fehler bei der Übertragung der Daten.',
      [{ label: 'Schließen', action: () => this.closeWindow() }]
    );
  }

  closeWindow() {
    if (this.popup) {
      this.popup.close();
    } else {
      this.featureFlagService.log(1, 'Popup instance is null.');
    }
  }
}

