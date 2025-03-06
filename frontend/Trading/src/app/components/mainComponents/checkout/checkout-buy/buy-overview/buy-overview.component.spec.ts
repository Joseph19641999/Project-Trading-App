import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyOverviewComponent } from './buy-overview.component';
import { CheckoutBuyComponent } from '../checkout-buy.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BuyOverviewComponent', () => {
  let component: BuyOverviewComponent;
  let fixture: ComponentFixture<BuyOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyOverviewComponent, CheckoutBuyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CheckoutBuyComponent, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(BuyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


