import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDataService } from './user.service';
import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private userService: UserDataService,
    private featureFlagService: FeatureFlagService
  ) { }

  private getAuthorizationHeader(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private dev = 'http://localhost:3000';
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private apiUrl = this.dev;




  public async purchase(transactionData: any): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post<any>(`${this.apiUrl}/purchase`, transactionData, {
        headers: this.getAuthorizationHeader()
      }));
      return response;
    } catch (error) {
      this.featureFlagService.log(1, 'Error: ' + error);
      return Promise.reject('Something went wrong. Please try again later.');
    }
  }

  public async sale(transactionData: any): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post<any>(`${this.apiUrl}/sale`, transactionData, {
        headers: this.getAuthorizationHeader()
      }));
      return response;
    } catch (error) {
      this.featureFlagService.log(1, 'Error: ' + error);
      return Promise.reject('Something went wrong. Please try again later.');
    }
  }







  public getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transaction/${id}`, {
      headers: this.getAuthorizationHeader()
    }).pipe(
      catchError(error => {
        this.featureFlagService.log(1, 'Error fetching transaction by ID: ' + error);
        return throwError(error);
      })
    );
  }





  public getSaleTransactions(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/transactions/sale`;
          lastValueFrom(this.http.get<any>(url, { headers: this.getAuthorizationHeader() }))
            .then(transactions => {
              this.featureFlagService.log(3, 'Sale transactions received: ' + transactions);
              observer.next(transactions);
              observer.complete();
            })
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting sale transactions: ' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data: ' + error);
          observer.error(error);
        });
    });
  }

  public getPurchaseTransactions(): Observable<any> {
    return new Observable(observer => {
      this.userService.getUserData()
        .then(user => {
          const url = `${this.apiUrl}/user/${user.id}/transactions/purchase`;
          lastValueFrom(this.http.get<any>(url, { headers: this.getAuthorizationHeader() }))
            .then(transactions => {
              this.featureFlagService.log(3, 'Purchase transactions received: ' + transactions);
              observer.next(transactions);
              observer.complete();
            })
            .catch(error => {
              this.featureFlagService.log(1, 'Error getting purchase transactions: ' + error);
              observer.error(error);
            });
        })
        .catch(error => {
          this.featureFlagService.log(1, 'Error getting user data: ' + error);
          observer.error(error);
        });
    });
  }
}
