import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
// import { EXCHANGE_URL } from "@sp/config";
import { LearningDropDownComponent } from "../learning-drop-down/learning-drop-down.component";
import { NavigationService } from "@sp/core/providers";

@Component({
  selector: 'sp-header',
  standalone: true,
  imports: [CommonModule, LearningDropDownComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showHeader = false;
  public menuClosed = true;
  exchangeUrl="";
  constructor(private router: Router,
              @Inject(PLATFORM_ID) private platformId: string) {
    this.showHeader = isPlatformBrowser(platformId);
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }
}
