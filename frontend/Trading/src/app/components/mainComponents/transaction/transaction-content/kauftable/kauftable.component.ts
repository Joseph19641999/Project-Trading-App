import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { firstValueFrom } from 'rxjs';

import { TransactionService } from 'src/app/services/api-services/transaction.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { AssetTableDTO } from 'src/app/models/asset-table.DTO';



@Component({
  selector: 'app-kauftable',
  templateUrl: './kauftable.component.html',
  styleUrls: ['./kauftable.component.scss']
})
export class KauftableComponent implements OnInit, AfterViewInit {
  buyData: MatTableDataSource<AssetTableDTO> = new MatTableDataSource<AssetTableDTO>([]);
  displayedColumns: string[] = [
    'id', 'aktienFondsSymbol', 'aktienFondsName', 'menge',
    'transaktionsdatum', 'einzelpreis', 'gesamtpreis', 'isFund'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private transactionService: TransactionService, private featureFlagService: FeatureFlagService) {}

  async ngOnInit(): Promise<void> {
    await this.loadPurchaseInfo();
  }

  ngAfterViewInit(): void {
    this.buyData.paginator = this.paginator;
    this.buyData.sort = this.sort;
  }

  async loadPurchaseInfo(): Promise<void> {
    try {
      const data: any = await firstValueFrom(this.transactionService.getPurchaseTransactions());
      if (data) {
        this.featureFlagService.log(3, `Sale Transactions Data received: ${JSON.stringify(data)}`);
        this.buyData.data = data;
      } else {
        this.featureFlagService.log(2, 'No sale transactions data received');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading sale transactions: ${error}`);
    }
  }

}
