import {
  Component,
  inject,
  Inject,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiSidebar, TuiSidebarDirective } from '@taiga-ui/addon-mobile';
import { LearningDropDownComponent } from '../learning-drop-down/learning-drop-down.component';
import { filter, Observable, take } from 'rxjs';
import { AppStateService } from '@sp/core/state/app-state.service';
import { TuiActiveZone } from '@taiga-ui/cdk';
import { CoursesSidenavComponent } from '../courses-sidenav';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { Course } from '@sp/core/models';
import { EXCHANGE_URL } from '@sp/config';
import { LoginDialogService } from '../login-dialog.service';

@Component({
  selector: 'sp-header',
  standalone: true,
  imports: [CommonModule,
    LearningDropDownComponent,
    RouterModule,
    TuiSidebar,
    TuiSidebarDirective,
    TuiActiveZone,
    CoursesSidenavComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  sidebarOpen = false;
  courses$: Observable<Course[]>;
  renderer = inject(Renderer2);
  public menuClosed = true;
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
  constructor(private router: Router,
              appStateService: AppStateService,
              private coursesStateService: CoursesStateService,
              private loginDialogService: LoginDialogService,
              @Inject(EXCHANGE_URL) public exchangeUrl: string) {
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

  openModal() {
    this.loginDialogService.open();
  }


  protected toggle(open: boolean): void {
    if (open) {
      this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.sidebarOpen = true;
          this.renderer.setStyle(document.body, 'overflow', 'hidden');
        } else {
          this.openModal();
        }
      });
    } else {
      this.sidebarOpen = false;
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

}
