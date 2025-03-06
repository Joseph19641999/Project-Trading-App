import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { UserDataService } from 'src/app/services/api-services/user.service';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { TransactionService } from 'src/app/services/api-services/transaction.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

import { CheckoutBuyComponent } from '../checkout-buy.component';

import { StockDataDTO } from 'src/app/models/stock-data.DTO';
import { CustomerDTO } from 'src/app/models/customer.DTO';



@Component({
  selector: 'app-buy-overview',
  templateUrl: './buy-overview.component.html',
  styleUrls: ['./buy-overview.component.scss']
})
export class BuyOverviewComponent implements OnInit{
  stockData: StockDataDTO | undefined;
  userData: CustomerDTO | undefined;

  sum: number = 0;
  quantity: number = 0;
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
    private auth: AuthenticateService,
    private check: CheckoutBuyComponent,
    private featureFlagService: FeatureFlagService
  ) {
    this.webSocketService.connect();
    this.initializeUserData();
  }




  async ngOnInit() {
    this.initializeUserData();
    this.stockData = this.check.data.Data;
  }

  closeWindow() {
    this.check.closeDialog();
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

  checkQuantity() {
    const quantity = this.firstFormGroup.get('quantity')?.value;
    if (quantity >= 1) {
      this.quantity = quantity;
      this.confirmPurchase(quantity);
    } else {
      this.quantityErrorDialog();
    }
  }


  async initializeUserData(): Promise<void> {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userDataService.getUserData();
        this.featureFlagService.log(3, `Logged in user data:  ${JSON.stringify(this.userData)}`);
      } else {
        this.featureFlagService.log(3, 'User is not logged in');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing user data: ${error}`);
      this.dataErrorDialog();
    }
  }






  async confirmPurchase(quantity: number): Promise<void> {
    try {
      if (this.userData && this.stockData && quantity >= 1 && this.isLoggedIn) {
        this.calculateSum();
        await this.initializeUserData();
  
        if (this.userData.budget < this.sum) {
          this.budgetErrorDialog();
          throw new Error('Insufficient budget');
        }
  
        await this.buyTransaction(
          this.userData.id, this.stockData.companyName, this.stockData.symbol, quantity,
          this.stockData.price, this.stockData.price * quantity, this.stockData.price, 0, 0, this.stockData.isFund
        );
  
        this.initializeUserData();
  
        this.firstFormGroup.get('firstCtrl')?.setValue('valid');
        this.firstFormGroup.markAsTouched();
        this.firstFormGroup.updateValueAndValidity();
  
        if (this.stepper.selected) {
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      } else {
        this.featureFlagService.log(1, 'userData or stockData is undefined or user is not logged in');
        this.dataErrorDialog();
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error processing purchase: ${error}`);
      this.purchaseErrorDialog();
    }
  }
  

  
  async buyTransaction(
    userId: number, aktienFondsName: string, aktienFondsSymbol: string, menge: number,
    einzelwert: number, gesamtwert: number, eintiegkurs: number, rendite: number, rendite_in_procent: number,
    isFund: boolean
  ): Promise<void> {
    try {
      const response = await this.transactionService.purchase(
        { userId, aktienFondsName, aktienFondsSymbol, menge, einzelwert, gesamtwert, eintiegkurs, rendite, rendite_in_procent, isFund }
      );
  
      this.featureFlagService.log(3, 'Purchase response: ' + JSON.stringify(response));
    } catch (error) {
      this.featureFlagService.log(1, 'Error processing purchase: ' + error);
      this.purchaseErrorDialog();
    }
  }










  cancelDialog(): void {
    this.dialog.openDialog(
      'Transaktion abbrechen?',
      'Sind Sie sicher, dass Sie die Transaktion abbrechen wollen?',
      [
        { label: 'Fortsetzen', action: () => console.log('Transaktion wird fortgesetzt.') },
        { label: 'Abbrechen', action: () => this.closeWindow() },
      ]
    );
  }

  buyDialog(): void {
    this.dialog.openDialog(
      'Kauf bestätigen?',
      'Sind Sie sicher, dass Sie den Kauf bestätigen wollen?',
      [
        { label: 'Abbrechen', action: () => console.log('Transaktion wird fortgesetzt.') },
        { label: 'Kaufen', action: () => this.checkQuantity() },
      ]
    );
  }

  quantityErrorDialog(): void {
    this.dialog.openDialog(
      'Ungültige Anzahl!',
      'Bitte geben Sie eine gültige Anzahl ein.',
      [{ label: 'okay', action: () => undefined }]
    );
  }

  purchaseErrorDialog(): void {
    this.dialog.openDialog(
      'Fehler beim Kauf!',
      'Etwas ist schiefgelaufen.',
      [{ label: 'Schließen', action: () => this.closeWindow() }]
    );
  }

  budgetErrorDialog(): void {
    this.dialog.openDialog(
      'Ungenügendes Budget!',
      'Bitte Budget auffüllen oder Anzahl verringern.',
      [{ label: 'okay', action: () => undefined }]
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
