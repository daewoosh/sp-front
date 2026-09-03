import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_PATH, AUTH_URL } from '@sp/config';

import { AuthTokenStorageService } from '../providers/auth-token-storage.service';
import { AuthInterceptor } from './auth-interceptor.service';

describe('AuthInterceptor', () => {
  const apiPath = 'https://safe-poker.io/learn/api/v1';
  const authUrl = 'https://safe-poker.io/api/v1';
  const storage = { getToken: jest.fn(() => 'user-token') };
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthTokenStorageService, useValue: storage },
        { provide: API_PATH, useValue: apiPath },
        { provide: AUTH_URL, useValue: authUrl },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('adds a bearer only to scoped API URLs', () => {
    http.get(`${apiPath}/courses`).subscribe();
    const apiRequest = controller.expectOne(`${apiPath}/courses`);
    expect(apiRequest.request.headers.get('Authorization')).toBe('Bearer user-token');
    apiRequest.flush({});

    http.get('https://third-party.example/data').subscribe();
    const foreignRequest = controller.expectOne('https://third-party.example/data');
    expect(foreignRequest.request.headers.has('Authorization')).toBe(false);
    foreignRequest.flush({});

    http.get('https://safe-poker.io.evil.example/learn/api/v1/data').subscribe();
    const lookalikeRequest = controller.expectOne(
      'https://safe-poker.io.evil.example/learn/api/v1/data'
    );
    expect(lookalikeRequest.request.headers.has('Authorization')).toBe(false);
    lookalikeRequest.flush({});
  });

  it('preserves a caller-provided Authorization header', () => {
    http.get(`${apiPath}/courses`, {
      headers: { Authorization: 'Bearer caller-token' },
    }).subscribe();

    const request = controller.expectOne(`${apiPath}/courses`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer caller-token');
    request.flush({});
  });
});
