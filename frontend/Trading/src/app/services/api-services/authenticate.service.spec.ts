import { TestBed } from '@angular/core/testing';
import { AuthenticateService } from './authenticate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthenticateService', () => {
  let service: AuthenticateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthenticateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

