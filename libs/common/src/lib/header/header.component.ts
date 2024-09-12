import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from "@sp/core";
import { Router, RouterModule } from "@angular/router";
// import { EXCHANGE_URL } from "@sp/config";
import { LearningDropDownComponent } from "../learning-drop-down/learning-drop-down.component";

@Component({
  selector: 'sp-header',
  standalone: true,
  imports: [CommonModule, LearningDropDownComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public menuClosed = true;
  exchangeUrl="";
  constructor(public navService: NavigationService,
              private router: Router) {
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }
}
