import { Injectable } from '@angular/core';
import { UserDataService } from './user.service';
import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
    private userDataService: UserDataService,
    private featureFlagService: FeatureFlagService
  ) {}

  public async isLoggedIn(): Promise<boolean> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.featureFlagService.log(3, 'User is not logged in: No token found.');
      return false;
    }

    try {
      const userData = await this.userDataService.getUserData();
      if (userData) {
        this.featureFlagService.log(3, 'User is logged in.');
        return true;
      } else {
        this.featureFlagService.log(1, 'User authentication failed: User data not available.');
        return false;
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error checking user authentication: ${error}`);
      return false;
    }
  }
}
