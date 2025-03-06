import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailsComponent } from './asset-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AssetDetailsComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetDetailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
