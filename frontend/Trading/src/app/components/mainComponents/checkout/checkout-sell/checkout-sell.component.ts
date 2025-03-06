import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';



@Component({
  selector: 'app-checkout-sell',
  templateUrl: './checkout-sell.component.html',
  styleUrls: ['./checkout-sell.component.scss']
})
export class CheckoutSellComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CheckoutSellComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private featureFlagService: FeatureFlagService
  ) { }

  ngOnInit(): void {
    this.featureFlagService.log(3, `Received data in Sell Window: ${JSON.stringify(this.data)}`);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
