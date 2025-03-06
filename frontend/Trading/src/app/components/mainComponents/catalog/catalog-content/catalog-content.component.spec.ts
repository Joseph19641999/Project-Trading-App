import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogContentComponent } from './catalog-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

describe('CatalogContentComponent', () => {
  let component: CatalogContentComponent;
  let fixture: ComponentFixture<CatalogContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogContentComponent],
      imports: [HttpClientTestingModule, MatTableModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CatalogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

