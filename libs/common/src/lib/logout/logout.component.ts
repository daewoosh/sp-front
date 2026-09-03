import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppStateService } from "@sp/core/state";
import { AuthTokenStorageService } from "@sp/core/providers";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { AUTH_URL, EXCHANGE_URL } from '@sp/config';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, finalize, timeout } from 'rxjs';

@Component({
  selector: 'sp-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit{
  constructor(private appStateService: AppStateService,
              private httpClient: HttpClient,
              private authTokenStorage: AuthTokenStorageService,
              private coursesStateService: CoursesStateService,
              @Inject(PLATFORM_ID) private platformId: object,
              @Inject(AUTH_URL) private authUrl: string,
              @Inject(EXCHANGE_URL) public exchangeUrl: string) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.authTokenStorage.clearToken();
    this.appStateService.logout();
    this.coursesStateService.clearCourses();
    this.httpClient.post(`${this.authUrl}/auth/logout`, {}, {
      withCredentials: true,
    }).pipe(
      timeout(3000),
      catchError(() => EMPTY),
      finalize(() => {
        window.location.href = this.exchangeUrl;
      })
    ).subscribe();
  }
}
