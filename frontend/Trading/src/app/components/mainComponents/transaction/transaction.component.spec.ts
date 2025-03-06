import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionComponent } from './transaction.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
