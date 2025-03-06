import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError } from 'rxjs/operators';
import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private featureFlagService: FeatureFlagService
  ) { }
  private dev = 'http://localhost:3000';
  private prod = 'https://test-backend-2dp6nnqy4a-ey.a.run.app';

  private apiUrl = this.dev;


  public getUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        reject(new Error('User is not logged in'));
        return;
      }

      const user = this.getUserFromToken(token);
      if (!user) {
        reject(new Error('Error decoding token'));
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get<any>(`${this.apiUrl}/user/${user.userId}`, { headers })
        .pipe(
          catchError(error => {
            if (error.status === 403) {
              this.featureFlagService.log(2, 'Token expired or not valid:' + error);
            } else {
              this.featureFlagService.log(1, 'Error fetching user data:' + error);
            }
            throw error;
          })
        )
        .subscribe(
          (data) => {
            this.featureFlagService.log(3, 'User data received:' + data);
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }





  public getUserFromToken(token: string): any {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      this.featureFlagService.log(1, 'Error decoding token:' + error);
      return null;
    }
  }

  public logout() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.featureFlagService.log(2, 'User is not logged in.');
      return;
    }
    try {
      sessionStorage.removeItem('token');
      this.featureFlagService.log(3, 'User is logged out');
      this.router.navigate(['/login']);
    } catch (error) {
      this.featureFlagService.log(1, 'Logout error:' + error);
    }
  }
}
