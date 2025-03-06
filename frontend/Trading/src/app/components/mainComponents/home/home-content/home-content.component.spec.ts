import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeContentComponent } from './home-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeContentComponent', () => {
  let component: HomeContentComponent;
  let fixture: ComponentFixture<HomeContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeContentComponent],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(HomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

