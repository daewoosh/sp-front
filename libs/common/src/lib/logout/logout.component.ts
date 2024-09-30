import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from "@sp/core/state";
import { Router } from "@angular/router";
import { LocalStorageService } from "@sp/core/providers";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { AUTH_HASH_NAME, AUTH_TOKEN_NAME } from "@sp/core";

@Component({
  selector: 'lib-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit{
  constructor(private appStateService: AppStateService,
              private router: Router,
              private localStorage: LocalStorageService,
              private coursesStateService: CoursesStateService,
              private cookieService: SsrCookieService) {}

  ngOnInit() {
    this.appStateService.logout();
    this.localStorage.remove(AUTH_TOKEN_NAME);
    this.localStorage.remove(AUTH_HASH_NAME);
    this.coursesStateService.clearCourses();
    this.cookieService.delete(AUTH_TOKEN_NAME);

    this.router.navigate(['/']);
  }
}
