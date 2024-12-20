import { Route } from '@angular/router';
import { CoursesResolver } from './courses-resolver.service';
import {
  CourseElementResolver,
  CourseProgramResolver,
} from './course-program-resolver.service';
import { CourseAccessGuard } from './course-access-guard.service';

export const coursesRoutes: Route[] = [
  {
    path: '',
    resolve: { CoursesResolver },
    data: { hideFooter: true },
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./course-item-page/course-item-page.component').then(
            (mod) => mod.CourseItemPageComponent
          ),
        resolve: { CourseProgramResolver },
        data: { hideFooter: true },
        canActivate: [CourseAccessGuard],
        children: [
          {
            path: ':order',
            loadComponent: () =>
              import('./courses-item/courses-item.component').then(
                (mod) => mod.CoursesItemComponent
              ),
            resolve: { item: CourseElementResolver },
            data: { hideFooter: true },
          },
        ],
      },
      {
        path: '',
        loadComponent: () =>
          import('./courses-list/courses-list.component').then(
            (mod) => mod.CoursesListComponent
          ),
        pathMatch: 'full',
        data: { hideFooter: true },
      },
    ],
  },
];
