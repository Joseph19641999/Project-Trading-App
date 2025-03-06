import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserDataService } from 'src/app/services/api-services/user.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userData: any | undefined;

  constructor(
    public router: Router,
    private userDataService: UserDataService,
    private auth: AuthenticateService,
    private dialog: DialogService,
    private featureFlagService: FeatureFlagService,
  ) {}

  ngOnInit(): void {
    this.initializeUserData();
  }

  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userDataService.getUserData();
      }
    } catch (error) {
      this.featureFlagService.log(1, `AssetOverviewComponent - initializeUserData: Error initializing user data: ${error}`);
    }
  }

  logout() {
    this.dialog.openDialog(
      'Sind Sie sicher?',
      'Wollen sie sich wirklich abmelden?',
      [
        { label: 'Abmelden', action: () => this.userDataService.logout() },
        { label: 'Abbrechen', action: () => undefined },
      ]
    );
  }
}
