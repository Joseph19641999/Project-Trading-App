import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';
import { FavoriteService } from 'src/app/services/api-services/favorite.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service';
import { UserDataService } from 'src/app/services/api-services/user.service';
import { DataService } from 'src/app/services/api-services/data.service';

import { firstValueFrom } from 'rxjs';

import { assetCatalogDTO } from 'src/app/models/asset-catalog.DTO';

@Component({
  selector: 'app-catalog-content',
  templateUrl: './catalog-content.component.html',
  styleUrls: ['./catalog-content.component.scss']
})
export class CatalogContentComponent implements OnInit {

  @Input() view: number = 1;

  assetData: assetCatalogDTO[] = [];
  favData: assetCatalogDTO[] = [];

  displayedColumns: string[] = ['symbol', 'fav', 'companyName', 'price', 'changes', 'mktCap', 'action'];

  showStocks = true;
  userData: any | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService,
    private fav: FavoriteService, 
    private auth: AuthenticateService,
    private userDataService: UserDataService,
    private dialog: DialogService,
    private dataService: DataService,
  ) {}

  async ngOnInit() {
    await this.initializeUserData();
    this.loadAssetData();
    this.loadFavo();
  }

  async loadAssetData(): Promise<void> {
    try {
      const response: any = await firstValueFrom(this.dataService.getMostActiveData());
      if (response) {
        this.assetData = await response;
        await this.loadFavoritesForassetData();
      } else {
        this.featureFlagService.log(1, 'Failed to load asset data.');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error loading asset data: ${error}`);
    }
  }

  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userDataService.getUserData();
        this.featureFlagService.log(4, `Logged in user data: ${JSON.stringify(this.userData)}`);
      } else {
        this.featureFlagService.log(3, 'User is not logged in');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing user data: ${error}`);
    }
  }



  async loadFavoritesForassetData() {
    if (this.isLoggedIn && this.userData) {
      for (let element of this.assetData) {
        element.isFavorite = await this.fav.isFavorite(this.userData?.id, element?.symbol);
      }
    }
  }

  async loadFavoritesForFavData() {
    if (this.isLoggedIn && this.userData) {
      for (let element of this.favData) {
        element.isFavorite = await this.fav.isFavorite(this.userData.id, element.symbol);
      }
    }
  }



  trade(element: any) {
    this.featureFlagService.log(3, `Trading: ${JSON.stringify(element)}`);
    this.router.navigate(['/asset', element.symbol]);
  }

  goToStockPage(stock: any): void {
    this.router.navigate(['/asset', stock.symbol]);
  }




  async loadFavo() {
    if (this.isLoggedIn) {
      try {
        this.fav.getFavorites().subscribe(
          async (data: any) => {
            this.featureFlagService.log(4, `Raw stock data from backend: ${JSON.stringify(data)}`);
            this.favData = data;
            await this.loadFavoritesForFavData();
            this.featureFlagService.log(4, `Fav data loaded and formatted: ${JSON.stringify(this.favData)}`);
          },
          (error: any) => {
            this.featureFlagService.log(1, "Error loading stock information: " + error);
          }
        );
      } catch (error) {
        this.featureFlagService.log(1, "Error loading stock information: " + error);
      }
    } else {
      this.loginErrorDialog();
    }
  }

  async toggleFavorite(element: any) {
    if (this.userData) {
      try {
        await this.fav.addFavorite(this.userData.id, element.symbol);
        await this.loadFavo();
        element.isFavorite = !element.isFavorite;
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      console.error('User is not logged in');
    }
  }






  private loginErrorDialog() {
    this.dialog.openDialog(
      'Nicht Eingeloggt!',
      'Bitte melden Sie sich an.',
      [{ label: 'Okay', action: () => undefined }]
    );
  }
}
