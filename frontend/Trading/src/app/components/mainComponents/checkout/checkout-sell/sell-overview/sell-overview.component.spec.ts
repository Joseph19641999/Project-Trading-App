import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellOverviewComponent } from './sell-overview.component';
import { CheckoutSellComponent } from '../checkout-sell.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

const mockCheckoutSellComponent = {
  Data: {
    subscribe: (callback: any) => callback({
      id: 1,
      amount: 10,
      price: 100
    })
  }
};

xdescribe('SellOverviewComponent', () => {
  let component: SellOverviewComponent;
  let fixture: ComponentFixture<SellOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellOverviewComponent, CheckoutSellComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { 
          provide: CheckoutSellComponent, 
          useValue: mockCheckoutSellComponent
        }
      ]
    });
    fixture = TestBed.createComponent(SellOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});


