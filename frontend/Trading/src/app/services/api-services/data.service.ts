import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StockHistoryDTO } from 'src/app/models/stock-history.DTO';
import { StockDataDTO } from 'src/app/models/stock-data.DTO';
import { assetCatalogDTO } from 'src/app/models/asset-catalog.DTO';

import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dev = 'http://localhost:3000';
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private apiUrl = this.dev;

  constructor(private http: HttpClient, private featureFlagService: FeatureFlagService) { }



  getStockHistoricalData(symbol: string): Observable<StockHistoryDTO[]> {
    const url = `${this.apiUrl}/assets/historical/${symbol}`;
    this.featureFlagService.log(3, `Fetching historical Stock data from backend: ${url}`);
    return this.http.get<{ historical: StockHistoryDTO[] }>(url).pipe(
      map(response => {
        const data = response.historical;
        this.featureFlagService.log(3, `Historical Stock data received: ${JSON.stringify(data)}`);
        if (!data || !Array.isArray(data)) {
          this.featureFlagService.log(2, 'No historical data received from backend.');
          return [];
        }
        return data;
      }),
      catchError(error => {
        this.featureFlagService.log(1, `Error fetching Stock History data from backend: ${error.message}`);
        return of([]);
      })
    );
  }


  getStockFundamentalData(symbol: string): Observable<StockDataDTO | null> {
    const url = `${this.apiUrl}/assets/fundamentals/${symbol}`;
    this.featureFlagService.log(3, `Fetching fundamental Stock data from backend: ${url}`);
    return this.http.get<StockDataDTO>(url).pipe(
      map(data => {
        this.featureFlagService.log(3, `Fundamental Stock data received: ${JSON.stringify(data)}`);
        if (!data) {
          this.featureFlagService.log(2, 'No fundamental data received from backend.');
          return null;
        }
        return new StockDataDTO(data);
      }),
      catchError(error => {
        this.featureFlagService.log(1, `Error fetching Stock fundamental data from backend: ${error.message}`);
        return of(null);
      })
    );
  }


  getMostActiveData(): Observable<any | null> {
    const url = `${this.apiUrl}/assets/most-active`;
    this.featureFlagService.log(3, `Fetching most active asset asset data from backend: ${url}`);
    return this.http.get<assetCatalogDTO>(url).pipe(
      map(data => {
        this.featureFlagService.log(3, `most active asset data received: ${JSON.stringify(data)}`);
        if (!data) {
          this.featureFlagService.log(2, 'No most active asset data received from backend.');
          return null;
        }
        return data;
      }),
      catchError(error => {
        this.featureFlagService.log(1, `Error fetching Stock most active asset data from backend: ${error.message}`);
        return of(null);
      })
    );
  }



  getShowcaseData(): Observable<any | null> {
    const url = `${this.apiUrl}/assets/showcase`;
    this.featureFlagService.log(3, `Fetching showcase asset asset data from backend: ${url}`);
    return this.http.get<assetCatalogDTO>(url).pipe(
      map(data => {
        this.featureFlagService.log(3, `showcase asset data received: ${JSON.stringify(data)}`);
        if (!data) {
          this.featureFlagService.log(2, 'No showcase asset data received from backend.');
          return null;
        }
        return data;
      }),
      catchError(error => {
        this.featureFlagService.log(1, `Error fetching Stock showcase asset data from backend: ${error.message}`);
        return of(null);
      })
    );
  }










}
