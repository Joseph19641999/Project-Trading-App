import { TestBed } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PortfolioService', () => {
  let service: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
