import { Component, inject, Inject, INJECTOR, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TuiSidebar, TuiSidebarDirective } from '@taiga-ui/addon-mobile';
import { LearningDropDownComponent } from "../learning-drop-down/learning-drop-down.component";
import { filter, Observable, take } from "rxjs";
import { AppStateService } from "@sp/core/state/app-state.service";
import { TuiDialogService } from "@taiga-ui/core";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiActiveZone } from "@taiga-ui/cdk";
import { CoursesSidenavComponent } from "../courses-sidenav";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { Course } from "@sp/core/models";

@Component({
  selector: 'sp-header',
  standalone: true,
  imports: [CommonModule, LearningDropDownComponent, RouterModule, LoginModalComponent, TuiSidebar, TuiSidebarDirective, TuiActiveZone, CoursesSidenavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  sidebarOpen = false;
  courses$: Observable<Course[]>;


  showHeader = true;
  public menuClosed = true;
  exchangeUrl = "";
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  links = [{
    label: 'Курсы',
    url: '/courses'
  }, {
    label: 'Профиль',
    url: '/profile'
  }, {
    label: 'Войти',
    url: '/login'
  }, {
    label: 'Зарегистрироваться',
    url: '/register'
  }]
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
              private dialogs2: TuiDialogService,
              private coursesStateService: CoursesStateService) {
    // this.showHeader = isPlatformBrowser(platformId);
    this.isLoggedIn$ = appStateService.isLoggedIn$;
    this.isAdmin$ = appStateService.isAdmin$;
    this.courses$ = this.coursesStateService.selectCourses;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.sidebarOpen = false;
      });
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }

  openModal(content: any) {
    this.dialog.subscribe({
      next: (data) => {
        // console.info(`Dialog emitted data = ${data}`);
      },
      complete: () => {
        // console.info('Dialog closed');
      },
    });
  }

  protected toggle(open: boolean): void {
    if (open) {
      this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.sidebarOpen = true;
        } else {
          this.openModal(LoginModalComponent);
        }
      });
    } else {
      this.sidebarOpen = false;
    }
  }
}
