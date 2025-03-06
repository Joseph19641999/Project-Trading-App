import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetChartComponent } from './asset-chart.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AssetChartComponent', () => {
  let component: AssetChartComponent;
  let fixture: ComponentFixture<AssetChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(AssetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
