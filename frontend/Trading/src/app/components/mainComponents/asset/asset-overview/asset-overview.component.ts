import { Component, Input, OnInit } from '@angular/core';

import { DialogService } from 'src/app/services/utility-services/dialog.service';
import { UserDataService } from 'src/app/services/api-services/user.service';
import { PortfolioService } from 'src/app/services/api-services/portfolio.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';
import { FavoriteService } from 'src/app/services/api-services/favorite.service';

import { CheckoutBuyComponent } from '../../checkout/checkout-buy/checkout-buy.component';
import { CheckoutSellComponent } from '../../checkout/checkout-sell/checkout-sell.component';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { StockDataDTO } from 'src/app/models/stock-data.DTO';



@Component({
  selector: 'app-asset-overview',
  templateUrl: './asset-overview.component.html',
  styleUrls: ['./asset-overview.component.scss']
})
export class AssetOverviewComponent implements OnInit {

  @Input() assetData: StockDataDTO | null = null;

  private popup: MatDialogRef<any> | null = null;
  isFavorite: boolean = false;
  isLoggedIn: boolean = false;
  userData: any | undefined;
  userStockData: any | null = null;

  constructor(
    private dialog: DialogService, 
    private userDataService: UserDataService, 
    private portfolioService: PortfolioService,
    private auth: AuthenticateService,
    private WinDialog: MatDialog,
    private router:Router,
    private featureFlagService: FeatureFlagService,
    private fav: FavoriteService,
  ) {}

  ngOnInit(){
    this.initializeUserData();
  }

  ngOnChanges() {
    if (this.assetData) {
      this.checkFavorite();
    }
  }



  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userDataService.getUserData();
        if (this.assetData) {
          await this.checkFavorite();
        }
      }
    } catch (error) {
      this.featureFlagService.log(1, `AssetOverviewComponent - initializeUserData: Error initializing user data: ${error}`);
    }
  }






  async openBuyWindow() {
    await this.checkBeforeProcess(async () => {await this.processDialog('buy');}, 'opening Buy window', false);
  }

  async openSellWindow() {
    await this.checkBeforeProcess(async () => {await this.processDialog('sell');}, 'opening Sell window', true);
  }

  async openBuyDialog() {
    this.popup = this.WinDialog.open(CheckoutBuyComponent, {
      disableClose: true,
      data: { Data: this.assetData }
    });
  
    this.popup.afterClosed().subscribe(result => {
      this.featureFlagService.log(4, 'AssetOverviewComponent - openBuyDialog: Buy window closed.');
    });
  }

  async openSellDialog() {
    this.popup = this.WinDialog.open(CheckoutSellComponent, {
      disableClose: true,
      data: { Data: this.assetData }
    });
  
    this.popup.afterClosed().subscribe(result => {
      this.featureFlagService.log(4, 'AssetOverviewComponent - openSellDialog: Sell window closed.');
    });
  }






  async closeWindow() {
    if (this.popup) {
      this.popup.close();
    } else {
      this.featureFlagService.log(1, 'AssetOverviewComponent - closeWindow: Popup instance is null.');
    }
  }

  async routeBack() {
    this.featureFlagService.log(3, 'AssetOverviewComponent - routeBack: Navigating back to catalog');
    this.router.navigate(['/catalog']);
  }



  private async processDialog(type: string) {
    try {
      switch(type) {
        case 'buy': 
          this.featureFlagService.log(3, 'AssetOverviewComponent - processDialog: Opening buy dialog');
          this.openBuyDialog(); 
          break;
        case 'sell': 
          this.featureFlagService.log(3, 'AssetOverviewComponent - processDialog: Opening sell dialog');
          this.openSellDialog(); 
          break;
      }
    } catch (error) {
      this.featureFlagService.log(1, `AssetOverviewComponent - processDialog: Error opening popup for ${type}: ${error}`);
    }
  }




  
  private async checkPortfolio(): Promise<boolean> {
    try {
      if (!this.assetData) {
        this.featureFlagService.log(1, 'AssetOverviewComponent - checkPortfolio: Stock data is not available.');
        this.dataErrorDialog();
        return false;
      }

      const portfolios = await this.portfolioService.getPortfolioBySymbol(this.assetData.symbol).toPromise();
      this.userStockData = portfolios?.[0] || null;
      this.featureFlagService.log(4, `AssetOverviewComponent - checkPortfolio: User stock data: ${JSON.stringify(this.userStockData)}`);

      if (!this.userStockData) {
        this.portfolioErrorDialog();
        return false;
      }
      return true;

    } catch (error) {
      this.featureFlagService.log(1, `AssetOverviewComponent - checkPortfolio: Error fetching user portfolio: ${error}`);
      this.dataErrorDialog();
      return false;
    }
  }


  private async checkBeforeProcess(action: () => Promise<void>, actionName: string, checkPortfolio: boolean) {
    try {
      await this.initializeUserData();

      if (!this.isLoggedIn) {
        this.loginErrorDialog();
        return;
      }

      if (checkPortfolio) {
        const portfolioChecked = await this.checkPortfolio();
        if (!portfolioChecked) {
          return;
        }
      }
      this.featureFlagService.log(3, `AssetOverviewComponent - checkBeforeProcess: Performing action: ${actionName}`);
      await action();

    } catch (error) {
      this.featureFlagService.log(1, `AssetOverviewComponent - checkBeforeProcess: Error ${actionName}: ${error}`);
    }
  }


  async addFavorite() {
    if (this.isLoggedIn) {
      if (this.assetData && this.userData) {
        try {
          await this.fav.addFavorite(this.userData.id, this.assetData.symbol);
          await this.checkFavorite();

        } catch (error) {
          this.featureFlagService.log(1, `AssetOverviewComponent - addFavorite: Error adding favorite: ${error}`);
        }
      } else {
        this.featureFlagService.log(1, 'AssetOverviewComponent - addFavorite: User or asset data is not available.');
      }
    } else {
      this.loginErrorDialog();
    }
  }


  async checkFavorite() {
    if(this.isLoggedIn){
      if (this.assetData && this.userData) {
        try {
          this.isFavorite = await this.fav.isFavorite(this.userData.id, this.assetData.symbol);
          this.featureFlagService.log(4, `AssetOverviewComponent - checkFavorite: Is favorite: ${this.isFavorite}`);
        } catch (error) {
          this.featureFlagService.log(1, `AssetOverviewComponent - checkFavorite: Error checking favorite: ${error}`);
        }
      } else {
        this.featureFlagService.log(1, 'AssetOverviewComponent - checkFavorite: Data not loaded properly.');
      }
    } else {
      this.loginErrorDialog();
    }
  }





  imageError() {
    const img = document.querySelector('.overview-info-stock-image img');
    if (img) {
        img.setAttribute('src', '../../../../assets/noPic.svg');
    }
}


  
  private loginErrorDialog() {
    this.dialog.openDialog(
      'Nicht Eingeloggt!',
      'Bitte melden Sie sich an.',
      [{ label: 'Okay', action: () => undefined }]
    );
  }

  private portfolioErrorDialog() {
    this.dialog.openDialog(
      'Keine im Besitz!',
      `Sie besitzen keine ${(this.assetData?.isFund ? 'Fonds' : 'Aktien')} von ${this.assetData?.symbol}.`,
      [{ label: 'Okay', action: () => undefined }]
    );
  }

  private dataErrorDialog() {
    this.dialog.openDialog(
      'Datenübertragungsfehler!',
      'Es tut uns leid, es gab einen Fehler bei der Übertragung der Daten.',
      [{ label: 'Schließen', action: () => this.closeWindow() }]
    );
  }
}
