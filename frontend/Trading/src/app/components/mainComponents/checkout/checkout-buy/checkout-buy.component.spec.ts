import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckoutBuyComponent } from './checkout-buy.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CheckoutBuyComponent', () => {
  let component: CheckoutBuyComponent;
  let fixture: ComponentFixture<CheckoutBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutBuyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(CheckoutBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
