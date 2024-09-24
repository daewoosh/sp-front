import { Component, inject, Inject, INJECTOR, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
// import { EXCHANGE_URL } from "@sp/config";
import { LearningDropDownComponent } from "../learning-drop-down/learning-drop-down.component";
import { Observable } from "rxjs";
import { AppStateService } from "@sp/core/state/app-state.service";
import { TuiDialogService } from "@taiga-ui/core";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'sp-header',
  standalone: true,
  imports: [CommonModule, LearningDropDownComponent, RouterModule, LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  showHeader = false;
  public menuClosed = true;
  exchangeUrl = "";
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(LoginModalComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      appearance: 'sp-modal'
    },
  );

  constructor(private router: Router,
              @Inject(PLATFORM_ID) private platformId: string,
              private appStateService: AppStateService,
              private dialogs2: TuiDialogService) {
    this.showHeader = isPlatformBrowser(platformId);
    this.isLoggedIn$ = appStateService.isLoggedIn$;
    this.isAdmin$ = appStateService.isAdmin$;
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }

  openModal(content: any) {
    // this.dialogs.open(content, {appearance: 'sp-modal',}).subscribe(
    //   res=> console.log(res)
    // );

    this.dialog.subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }
}
