import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioContentComponent } from './portfolio-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

xdescribe('PortfolioContentComponent', () => {
  let component: PortfolioContentComponent;
  let fixture: ComponentFixture<PortfolioContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioContentComponent],
      imports: [HttpClientTestingModule, MatTabsModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(PortfolioContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
