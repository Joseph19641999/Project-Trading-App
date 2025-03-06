import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { firstValueFrom } from 'rxjs';

import { TransactionService } from 'src/app/services/api-services/transaction.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { AssetTableDTO } from 'src/app/models/asset-table.DTO';



@Component({
  selector: 'app-verkauftable',
  templateUrl: './verkauftable.component.html',
  styleUrls: ['./verkauftable.component.scss'],
})
export class VerkauftableComponent implements OnInit, AfterViewInit {
  saleData: MatTableDataSource<AssetTableDTO> =
    new MatTableDataSource<AssetTableDTO>([]);
  displayedColumns: string[] = [
    'id',
    'aktienFondsSymbol',
    'aktienFondsName',
    'menge',
    'transaktionsdatum',
    'einzelpreis',
    'gesamtpreis',
    'isFund',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    private featureFlagService: FeatureFlagService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSaleInfo();
  }

  ngAfterViewInit(): void {
    this.saleData.paginator = this.paginator;
    this.saleData.sort = this.sort;
  }


  async loadSaleInfo(): Promise<void> {
    try {
      const data: any = await firstValueFrom(this.transactionService.getSaleTransactions());
      if (data) {
        this.featureFlagService.log(3, `Sale Transactions Data received: ${JSON.stringify(data)}`);
        this.saleData.data = data;
      } else {
        this.featureFlagService.log(2, 'No sale transactions data received');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading sale transactions: ${error}`);
    }
  }

}
