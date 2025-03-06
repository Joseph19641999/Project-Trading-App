import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';


import { UserDataService } from 'src/app/services/api-services/user.service';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { TransactionService } from 'src/app/services/api-services/transaction.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service';
import { PortfolioService } from 'src/app/services/api-services/portfolio.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { CheckoutSellComponent } from '../checkout-sell.component';

import { StockDataDTO } from 'src/app/models/stock-data.DTO';
import { CustomerDTO } from 'src/app/models/customer.DTO';



@Component({
  selector: 'app-sell-overview',
  templateUrl: './sell-overview.component.html',
  styleUrls: ['./sell-overview.component.scss']
})
export class SellOverviewComponent implements OnInit {

  stockData: StockDataDTO | undefined;
  userData: CustomerDTO | null = null;
  userStockData: any | undefined;

  sum: number = 0;
  quantity = 0;
  isLoggedIn: boolean = false;

  @ViewChild('stepper') stepper!: MatStepper;


  firstFormGroup: FormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
    quantity: [0, Validators.required],
  });
  secondFormGroup: FormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });



  constructor(
    private webSocketService: WebSocketService,
    private userDataService: UserDataService,
    private dialog: DialogService,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private auth: AuthenticateService,
    private check: CheckoutSellComponent,
    private featureFlagService: FeatureFlagService
  ) {
    this.webSocketService.connect();
  }

  ngOnInit() {
    this.initializeUserData();
    this.stockData = this.check.data.Data;
  }

  closeWindow() {
    this.check.closeDialog();
  }




  checkQuantity() {
    const quantity = this.firstFormGroup.get('quantity')?.value;
    if (quantity >= 1) {
      this.quantity = quantity;
      this.confirmSale(quantity);
    } else {
      this.quantityErrorDialog();
    }
  }

  calculateSum() {
    const quantity = this.firstFormGroup.get('quantity')?.value;
    if (quantity >= 1) {
      this.sum = this.stockData?.price ? this.stockData.price * quantity : 0;
      this.sum = parseFloat(this.sum.toFixed(2));
    } else {
      this.sum = 0;
    }
  }




  
  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userDataService.getUserData();
        await this.getUserPortfolio();
        this.featureFlagService.log(3, `Logged in user data: ${JSON.stringify(this.userData)}`);
      } else {
        this.featureFlagService.log(2, 'User is not logged in');
        this.loginErrorDialog();
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing user data: ${error}`);
      this.dataErrorDialog();
    }
  }






  async confirmSale(quantity: number): Promise<void> {
    if (this.userData && this.stockData && quantity >= 1) {
      try {
        this.initializeUserData();

        await this.saleTransaction({
          userId: this.userData.id,
          aktienFondsName: this.stockData.companyName,
          aktienFondsSymbol: this.stockData.symbol,
          menge: quantity,
          einzelwert: this.stockData.price,
          gesamtwert: this.stockData.price * quantity,
          einstiegskurs: this.stockData.price,
          rendite: 0,
          rendite_in_procent: 0,
          isFund: this.stockData.isFund
        });

        this.initializeUserData();

        this.firstFormGroup.get('firstCtrl')?.setValue('valid');
        this.firstFormGroup.markAsTouched();
        this.firstFormGroup.updateValueAndValidity();

        if (this.stepper.selected) {
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      } catch (error) {
        this.featureFlagService.log(1, `Error processing sale: ${error}`);
        this.SellingErrorDialog();
      }
    } else {
      this.featureFlagService.log(1, 'Error: userData or stockData is undefined');
      this.dataErrorDialog();
    }
  }




  async getUserPortfolio(): Promise<void> {
    try {
      if (!this.userData) {
        this.featureFlagService.log(1, 'UserData not defined.');
        return;
      }
  
      if (this.stockData) {
        this.portfolioService.getPortfolioBySymbol(this.stockData.symbol)
          .subscribe((portfolios: any) => {
            this.userStockData = portfolios?.[0] || null;
            this.featureFlagService.log(3, `User data: ${JSON.stringify(this.userData)}`);
          }, (error) => {
            this.featureFlagService.log(1, `Error fetching user portfolio: ${error}`);
            this.dataErrorDialog();
          });
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error fetching user portfolio: ${error}`);
      this.dataErrorDialog();
    }
  }

  async saleTransaction(transactionData: any): Promise<void> {
    try {
      const response = await this.transactionService.sale(transactionData);
      this.featureFlagService.log(3, `Sale response: ${JSON.stringify(response)}`);
    } catch (error) {
      this.featureFlagService.log(1, `Error processing sale: ${error}`);
      this.dataErrorDialog();
    }
  }










  cancelDialog() {
    this.dialog.openDialog(
      'Verkauf abbrechen?',
      'Sind Sie sicher, dass Sie diesen Verkauf abbrechen wollen?',
      [
        { label: 'Fortsetzen', action: () => console.log('Verkauf wird fortgesetzt.') },
        { label: 'Abbrechen', action: () => this.closeWindow() }
      ]
    );
  }

  sellDialog() {
    this.dialog.openDialog(
      'Verkauf bestätigen?',
      'Sind Sie sicher, dass Sie den Verkauf bestätigen wollen?',
      [
        { label: 'Abbrechen', action: () => console.log('Verkauf wird fortgesetzt.') },
        { label: 'Verkaufen', action: () => this.checkQuantity() }
      ]
    );
  }

  quantityErrorDialog() {
    this.dialog.openDialog(
      'Ungültige Anzahl!',
      'Bitte geben sie eine gültige Anzahl ein.',
      [{ label: 'okay', action: () => undefined }]
    );
  }

  loginErrorDialog() {
    this.dialog.openDialog(
      'Nicht eingeloggt!',
      'Bitte melden Sie sich an.',
      [{ label: 'okay', action: () => undefined }]
    );
  }

  SellingErrorDialog(): void {
    this.dialog.openDialog(
      'Fehler beim Kauf!',
      'Etwas ist schiefgelaufen.',
      [{ label: 'Schließen', action: () => this.closeWindow() }]
    );
  }

  dataErrorDialog() {
    this.dialog.openDialog(
      'Datenübertragungsfehler!',
      'Es gab einen Fehler bei der Übertragung der Daten.',
      [{ label: 'okay', action: () => undefined }]
    );
  }
}
