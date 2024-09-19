import { TuiRoot } from "@taiga-ui/core";
import { afterNextRender, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SpCoreModule } from "@sp/core";
import { Subscription } from "rxjs";
import { WINDOW } from "@sp/sdk/common";
import { ViewportScroller } from "@angular/common";
import { CONFIG, EXCHANGE_URL } from "@sp/config";
import { environment } from "../environments/environment";
import { AppResolver } from "./app.resolver";

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

  constructor(private router: Router,
              @Inject(WINDOW) private window: Window,
              @Inject(PLATFORM_ID) private platformId: string,
              viewport: ViewportScroller) {
    viewport.setOffset([0, 100]);
  }

  public ngOnInit(): void {
    // this.subscription = this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     if (isPlatformBrowser(this.platformId)) {
    //       this.window.scrollTo(0, 0);
    //     }
    //   });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
