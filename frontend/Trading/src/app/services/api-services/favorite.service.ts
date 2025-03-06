import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { FeatureFlagService } from '../utility-services/feature-flag.service';
import { UserDataService } from './user.service';
import { DialogService } from '../utility-services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private dev = 'http://localhost:3000';
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private baseUrl = this.dev;

  constructor(
    private http: HttpClient,
    private featureFlagService: FeatureFlagService,
    private userService: UserDataService,
    private dialog: DialogService,
  ) {}

  private getAuthorizationHeader(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public async addFavorite(userId: number, assetSymbol: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/favorite/add`;
      const body = { userId, assetSymbol };
      const response = await lastValueFrom(this.http.post<any>(url, body));

      return response;
    } catch (error) {
      this.featureFlagService.log(1, `Error adding favorite: ${error}`);
      this.favDialog();
      return Promise.reject('Something went wrong. Please try again later.');
    }
  }

  public getFavorites(): Observable<any> {
    return new Observable((observer) => {
      this.userService
        .getUserData()
        .then((user) => {
          const url = `${this.baseUrl}/favorites/all/${user.id}`;
          this.featureFlagService.log(
            3,
            'Fetching Stock Portfolio from backend:' + url
          );
          this.http
            .get<any>(url)
            .toPromise()
            .then((stockPortfolio) => observer.next(stockPortfolio))
            .catch((error) => {
              this.featureFlagService.log(1, `Error getting stock portfolio: ${error}`);
              observer.error(error);
            });
        })
        .catch((error) => {
          this.featureFlagService.log(1, `Error getting user data: ${error}`);
          observer.error(error);
        });
    });
  }

  public async isFavorite(
    userId: number,
    assetSymbol: string
  ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/favorite/check?userId=${userId}&assetSymbol=${assetSymbol}`;
      const response = await lastValueFrom(
        this.http.get<{ isFavorite: boolean }>(url, {
          headers: this.getAuthorizationHeader(),
        })
      );
      return response.isFavorite;
    } catch (error) {
      this.featureFlagService.log(1, `Error checking favorite: ${error}`);
      return Promise.reject('Something went wrong. Please try again later.');
    }
  }



  private favDialog() {
    this.dialog.openDialog(
      'Maximale Favoriten!',
      'Sie können nur 20 favoriten hinzufügen.',
      [{ label: 'okay', action: () => undefined }]
    );
  }
}
