import { Route } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { RangesCategoriesResolver } from '@sp/core/providers';
import { RangeTableResolver } from './ranges-management/range-table-resolver.service';
import { AdminApiService } from './admin.api.service';

export const manageRangesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ranges-management/ranges-management.component').then(
        (mod) => mod.RangesManagementComponent
      ),
    resolve: { categories: RangesCategoriesResolver },
    children: [
      {
        path: ':positionId',
        loadComponent: () =>
          import('./ranges-management/ranges-table-management/ranges-table-management.component').then(
            (mod) => mod.RangesTableManagementComponent
          ),
        providers: [AdminApiService, RangeTableResolver],
        resolve: { tableData: RangeTableResolver },
      }
    ]
  },
];

export const adminRoutes: Route[] = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import('./courses-management/courses-management.component').then(
            (mod) => mod.CoursesManagementComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users-management/users-management.component').then(
            (mod) => mod.UsersManagementComponent
          ),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./courses-statistics/courses-statistics.component').then(
            (mod) => mod.CoursesStatisticsComponent
          ),
      },
    ],
  },
];
