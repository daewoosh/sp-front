import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from "@sp/core/state";
import { Router } from "@angular/router";
import { LocalStorageService } from "@sp/core/providers";

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
              private localStorage: LocalStorageService) {}

  ngOnInit() {
    this.appStateService.logout();
    this.localStorage.remove("authToken");
    this.localStorage.remove("authHash");
    this.router.navigate(['/']);
  }
}
