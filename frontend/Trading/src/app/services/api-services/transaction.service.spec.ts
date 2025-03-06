import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { UserDataService } from './user.service';
import { FeatureFlagService } from '../utility-services/feature-flag.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

fdescribe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  let userServiceMock: jasmine.SpyObj<UserDataService>;
  let featureFlagServiceMock: jasmine.SpyObj<FeatureFlagService>;

  beforeEach(() => {
    userServiceMock = jasmine.createSpyObj('UserDataService', ['getUserData']);
    featureFlagServiceMock = jasmine.createSpyObj('FeatureFlagService', ['log']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransactionService,
        { provide: UserDataService, useValue: userServiceMock },
        { provide: FeatureFlagService, useValue: featureFlagServiceMock }
      ]
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fdescribe('purchase', () => {
    it('should make a POST request to purchase endpoint', (done) => {
      const mockTransactionData = { amount: 100 };
      const mockResponse = { success: true };

      service.purchase(mockTransactionData).then(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('http://localhost:3000/purchase');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should log error and reject promise on failure', (done) => {
      const mockTransactionData = { amount: 100 };
      const mockError = { status: 500, statusText: 'Server Error' };

      service.purchase(mockTransactionData).catch(error => {
        expect(featureFlagServiceMock.log).toHaveBeenCalledWith(1, 'Error: [object Object]');
        expect(error).toBe('Something went wrong. Please try again later.');
        done();
      });

      const req = httpMock.expectOne('http://localhost:3000/purchase');
      req.flush('Something went wrong', mockError);
    });
  });

  fdescribe('sale', () => {
    it('should make a POST request to sale endpoint', (done) => {
      const mockTransactionData = { amount: 100 };
      const mockResponse = { success: true };

      service.sale(mockTransactionData).then(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('http://localhost:3000/sale');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should log error and reject promise on failure', (done) => {
      const mockTransactionData = { amount: 100 };
      const mockError = { status: 500, statusText: 'Server Error' };

      service.sale(mockTransactionData).catch(error => {
        expect(featureFlagServiceMock.log).toHaveBeenCalledWith(1, 'Error: [object Object]');
        expect(error).toBe('Something went wrong. Please try again later.');
        done();
      });

      const req = httpMock.expectOne('http://localhost:3000/sale');
      req.flush('Something went wrong', mockError);
    });
  });

  fdescribe('getTransactionById', () => {
    it('should make a GET request to the correct endpoint', (done) => {
      const mockTransactionId = 1;
      const mockResponse = { id: 1, amount: 100 };

      service.getTransactionById(mockTransactionId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`http://localhost:3000/transaction/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should log error and throw error on failure', (done) => {
      const mockTransactionId = 1;
      const mockError = { status: 404, statusText: 'Not Found' };

      service.getTransactionById(mockTransactionId).subscribe(
        () => fail('The getTransactionById method should throw an error'),
        error => {
          expect(featureFlagServiceMock.log).toHaveBeenCalledWith(1, 'Error fetching transaction by ID: [object Object]');
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/transaction/1`);
      req.flush('Not Found', mockError);
    });
  });
});