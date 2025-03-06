import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionContentComponent } from './transaction-content.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TransactionContentComponent', () => {
  let component: TransactionContentComponent;
  let fixture: ComponentFixture<TransactionContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionContentComponent],
      imports: [MatTabsModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(TransactionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

