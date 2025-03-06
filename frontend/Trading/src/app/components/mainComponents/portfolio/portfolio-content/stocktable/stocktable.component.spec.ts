import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StocktableComponent } from './stocktable.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TransactionService } from '../../../../../services/api-services/transaction.service';
import { of } from 'rxjs';

const mockTransactionService = {
  getTransactions: () => of([]),
};

xdescribe('StocktableComponent', () => {
  let component: StocktableComponent;
  let fixture: ComponentFixture<StocktableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StocktableComponent],
      imports: [HttpClientTestingModule, MatPaginatorModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});


