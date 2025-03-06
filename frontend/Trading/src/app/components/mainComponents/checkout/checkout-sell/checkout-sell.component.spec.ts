import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CheckoutSellComponent } from './checkout-sell.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CheckoutSaleComponent', () => {
  let component: CheckoutSellComponent;
  let fixture: ComponentFixture<CheckoutSellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutSellComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(CheckoutSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
