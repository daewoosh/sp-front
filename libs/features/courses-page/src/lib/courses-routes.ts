import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot, UrlTree
} from "@angular/router";
import { CoursesResolver } from "./courses-resolver.service";
import { CourseElementResolver, CourseProgramResolver } from "./course-program-resolver.service";
import { inject, Injectable, INJECTOR } from "@angular/core";
import { AppStateService } from "@sp/core/state";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { map, Observable, of, switchMap, take } from "rxjs";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { CourseNoAccessModalComponent } from "./course-no-access-modal/course-no-access-modal.component";

@Injectable()
export class CourseAccessGuard implements CanActivate {

  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private readonly dialog = this.dialogs.open<boolean>(
    new PolymorpheusComponent(CourseNoAccessModalComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      appearance: 'sp-modal'
    },
  );

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
    const id = route.params['id'];
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
            // Show the modal dialog without waiting
            this.dialogs.open<boolean>(
              new PolymorpheusComponent(
                CourseNoAccessModalComponent,
                this.injector
              ),
              {
                data: 237, // Pass any data if needed
                dismissible: true,
                appearance: 'sp-modal',
              }
            ).subscribe();

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

export const coursesRoutes: Route[] = [
  {
    path: "",
    resolve: {CoursesResolver},
    data: {hideFooter: true},
    children: [
      {
        path: ":id",
        loadComponent: () => import('./course-item-page/course-item-page.component').then(mod => mod.CourseItemPageComponent),
        resolve: {CourseProgramResolver},
        data: {hideFooter: true},
        canActivate: [CourseAccessGuard],
        children: [{
          path: ":order",
          loadComponent: () => import('./courses-item/courses-item.component').then(mod => mod.CoursesItemComponent),
          resolve: {item: CourseElementResolver},
          data: {hideFooter: true},
        }]
      },
      {
        path: "",
        loadComponent: () => import('./courses-list/courses-list.component').then(mod => mod.CoursesListComponent),
        pathMatch: "full",
        data: {hideFooter: true},
      },
    ]
  },
];
