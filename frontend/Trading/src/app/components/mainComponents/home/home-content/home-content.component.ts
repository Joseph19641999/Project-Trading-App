import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DataService } from 'src/app/services/api-services/data.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { assetCatalogDTO } from 'src/app/models/asset-catalog.DTO';


@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent {
  isLoggedIn: boolean = false;
  showcaseData: assetCatalogDTO[] = [];

  constructor(
    private router: Router,
    private auth: AuthenticateService,
    private dataService: DataService,
    private featureFlagService: FeatureFlagService
  ) {}

  async ngOnInit() {
    this.isLoggedIn = await this.auth.isLoggedIn();
    this.loadAssetData();
  }





  async loadAssetData(): Promise<void> {
    try {
      const response: any = await firstValueFrom(this.dataService.getShowcaseData());
      if (response) {
        this.showcaseData = await response;
        console.log(this.showcaseData);
      } else {
        this.featureFlagService.log(1, 'Failed to load showcase data.');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading showcase data: ${error}`);
    }
  }



  async checkRoute() {
    this.isLoggedIn = await this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      this.router.navigate(['/catalog']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
