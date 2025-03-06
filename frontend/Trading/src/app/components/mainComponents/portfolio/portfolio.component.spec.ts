import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioComponent } from './portfolio.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

xdescribe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
