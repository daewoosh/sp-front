import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SpCoreModule } from "@sp/core";
import { filter, Subscription } from "rxjs";
import { WINDOW } from "@sp/sdk/common";
import { isPlatformBrowser } from "@angular/common";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, TuiRoot, SpCoreModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sp-front';
  subscription?: Subscription;
  constructor(private router:Router,
              @Inject(WINDOW) private window: Window,
              @Inject(PLATFORM_ID) private platformId: string) {
  }

  public ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.window.scrollTo(0, 0);
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
