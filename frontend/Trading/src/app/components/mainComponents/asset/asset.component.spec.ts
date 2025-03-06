import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetComponent } from './asset.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HeaderComponent } from '../../layoutComponents/header/header.component';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { DataService } from 'src/app/services/api-services/asset.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';

const mockWebSocketService = {
  connect: jasmine.createSpy('connect'),
  isConnected$: of(true)
};

const mockDataService = {
  getStockFundamentalData: (symbol: string) => of([{ id: 1, name: 'Test Stock', price: 100 }])
};

const mockFeatureFlagService = {
  log: jasmine.createSpy('log')
};

describe('AssetComponent', () => {
  let component: AssetComponent;
  let fixture: ComponentFixture<AssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetComponent, HeaderComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: WebSocketService, useValue: mockWebSocketService },
        { provide: DataService, useValue: mockDataService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'test-symbol' })
          }
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStockData on init with the correct symbol', () => {
    spyOn(component, 'loadStockData').and.callThrough();
    component.ngOnInit();
    expect(component.loadStockData).toHaveBeenCalled();
  });
});


