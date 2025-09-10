import { inject, Injectable, INJECTOR, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { AppStateService } from '@sp/core/state';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CourseNoAccessModalComponent } from './course-no-access-modal/course-no-access-modal.component';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class CourseAccessGuard implements CanActivate {

  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private appStateService: AppStateService,
    private coursesStateService: CoursesStateService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const id = route.data['id'] ?? route.params['id'];
    if (!id) {
      // No course ID provided, redirect to home
      return of(this.router.createUrlTree(['/']));
    }

    // Check if the user is logged in
    return this.appStateService.isLoggedIn$.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // User is not logged in, redirect to home
          return of(this.router.createUrlTree(['/']));
        }

        // User is logged in, check if they have access to the course
        return this.coursesStateService.selectCourses.pipe(
          take(1),
          map((courses) => {
            const course = courses.find(
              (course) =>
                course.slug === id &&
                course.isAvailable === true &&
                course.purchased
            );
            if (course) {
              // User has access to the course, allow navigation
              return true;
            }

            // User does not have access to the course
            // Show the modal dialog only in browser (avoid SSR side effects)
            if (isPlatformBrowser(this.platformId)) {
              this.dialogs.open<boolean>(
                new PolymorpheusComponent(
                  CourseNoAccessModalComponent,
                  this.injector
                ),
                {
                  data: 237, // Pass any data if needed
                  dismissible: true,
                  appearance: 'sp-modal'
                }
              ).subscribe(
                navigate => {
                  if (navigate) {
                    this.router.navigate(['/courses']);
                  }
                }
              );
            }

            // Decide what to return based on whether the user navigated from within the app
            if (this.router.navigated) {
              // The user navigated from within the app
              // Cancel navigation and stay on the current page
              return false;
            } else {
              // The user entered the URL directly
              // Redirect to '/courses'
              return this.router.createUrlTree(['/courses']);
            }
          })
        );
      })
    );
  }
}
