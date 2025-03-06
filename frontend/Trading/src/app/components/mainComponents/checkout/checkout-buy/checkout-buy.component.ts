import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';


@Component({
  selector: 'app-checkout-buy',
  templateUrl: './checkout-buy.component.html',
  styleUrls: ['./checkout-buy.component.scss']
})


export class CheckoutBuyComponent {

  constructor(
    private dialogRef: MatDialogRef<CheckoutBuyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private featureFlagService: FeatureFlagService
  ) { }

  ngOnInit(): void {
    this.featureFlagService.log(3, `Received data in Buy Window: ${JSON.stringify(this.data)}`);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}