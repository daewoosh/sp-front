import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { CoursesResolver } from "./courses-resolver.service";
import { CourseElementResolver, CourseProgramResolver } from "./course-program-resolver.service";
import { inject, Injectable, INJECTOR } from "@angular/core";
import { AppStateService } from "@sp/core/state";
import { CoursesStateService } from "./courses-state.service";
import { map, of } from "rxjs";
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const id = route.params['id'];
    if (id) {
      return this.coursesStateService.selectCourses.pipe(
        map(courses => {
          const course = courses.find(course => course.slug === id && course.isAvailable === true);
          if (course || !courses.length) {
            return true;
          }
          this.dialog.subscribe(
            {
              next: (data) => {
                if (data) {
                  this.router.navigate(['/courses']);
                }
              }
            }
          );
          return false;
        })
      )
    }
    return of(false);
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
