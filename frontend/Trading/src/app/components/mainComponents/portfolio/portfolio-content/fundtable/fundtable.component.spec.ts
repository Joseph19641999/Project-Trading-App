import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundtableComponent } from './fundtable.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FundtableComponent', () => {
  let component: FundtableComponent;
  let fixture: ComponentFixture<FundtableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundtableComponent],
      imports: [HttpClientTestingModule, MatPaginatorModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FundtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


