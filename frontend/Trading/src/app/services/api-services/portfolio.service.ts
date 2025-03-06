import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from './user.service';
import { Observable } from 'rxjs';
import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(
    private http: HttpClient,
    private userService: UserDataService,
    private featureFlagService: FeatureFlagService
  ) {}

  private dev = 'http://localhost:3000';
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private apiUrl = this.dev;


  public getPortfolioBySymbol(symbol: string): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/portfolios`;
          this.http.get<any>(url)
            .toPromise()
            .then(portfolios => {
              this.featureFlagService.log(3, 'User portfolio received.');
              const filteredPortfolio = portfolios.filter((item: any) => item.aktienFondsSymbol === symbol);
              observer.next(filteredPortfolio);
              this.featureFlagService.log(4, 'Filtered portfolio:' + filteredPortfolio);
              observer.complete();
            })
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting user portfolio:' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data:' + error);
          observer.error(error);
        });
    });
  }









  public getStockPortfolio(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/portfolios/stock`;
          this.featureFlagService.log(3, 'Fetching Stock Portfolio from backend:' + url);
          this.http.get<any>(url)
            .toPromise()
            .then(stockPortfolio => observer.next(stockPortfolio))
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting stock portfolio:' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data:' + error);
          observer.error(error);
        });
    });
  }

  public getFundPortfolio(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/portfolios/fund`;
          this.featureFlagService.log(3, 'Fetching Fund Portfolio from backend:' + url);
          this.http.get<any>(url)
            .toPromise()
            .then(fundPortfolio => observer.next(fundPortfolio))
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting fund portfolio:' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data:' + error);
          observer.error(error);
        });
    });
  }









  public getRenditeStock(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/portfolios/Rendite/stock`;
          this.featureFlagService.log(3, 'Fetching stock rendite from backend:' + url);
          this.http.get<any>(url)
            .toPromise()
            .then(stockRendite => observer.next(stockRendite))
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting stock rendite:' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data:' + error);
          observer.error(error);
        });
    });
  }

  public getRenditeFund(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/portfolios/Rendite/fund`;
          this.featureFlagService.log(3, 'Fetching fund rendite from backend:' + url);
          this.http.get<any>(url)
            .toPromise()
            .then(fundRendite => observer.next(fundRendite))
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting fund rendite:' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data:' + error);
          observer.error(error);
        });
    });
  }
}
