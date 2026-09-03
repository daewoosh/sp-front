import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AUTH_URL, EXCHANGE_URL } from '@sp/config';
import { AuthTokenStorageService } from '@sp/core/providers';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { AppStateService } from '@sp/core/state';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  const authUrl = 'https://safe-poker.io/api/v1';
  const tokenStorage = { clearToken: jest.fn() };
  const appState = { logout: jest.fn() };
  const coursesState = { clearCourses: jest.fn() };
  let controller: HttpTestingController;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LogoutComponent],
      providers: [
        { provide: AuthTokenStorageService, useValue: tokenStorage },
        { provide: AppStateService, useValue: appState },
        { provide: CoursesStateService, useValue: coursesState },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AUTH_URL, useValue: authUrl },
        { provide: EXCHANGE_URL, useValue: window.location.href },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('clears local state synchronously before best-effort server logout', () => {
    const component = TestBed.createComponent(LogoutComponent).componentInstance;
    component.ngOnInit();

    expect(tokenStorage.clearToken).toHaveBeenCalledTimes(1);
    expect(appState.logout).toHaveBeenCalledTimes(1);
    expect(coursesState.clearCourses).toHaveBeenCalledTimes(1);
    const request = controller.expectOne(`${authUrl}/auth/logout`);
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    request.flush({});
  });
});
