import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCheckoutComponent } from './header-checkout.component';

describe('HeaderCheckoutComponent', () => {
  let component: HeaderCheckoutComponent;
  let fixture: ComponentFixture<HeaderCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderCheckoutComponent]
    });
    fixture = TestBed.createComponent(HeaderCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
