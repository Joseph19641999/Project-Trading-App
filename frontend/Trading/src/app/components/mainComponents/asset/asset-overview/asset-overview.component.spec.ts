import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetOverviewComponent } from './asset-overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AssetOverviewComponent', () => {
  let component: AssetOverviewComponent;
  let fixture: ComponentFixture<AssetOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetOverviewComponent],
      imports: [HttpClientTestingModule, MatIconModule, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(AssetOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
