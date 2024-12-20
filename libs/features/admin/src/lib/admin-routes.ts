import { Route } from "@angular/router";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { UsersManagementComponent } from './users-management/users-management.component';

export const adminRoutes: Route[] = [
  {
    path:"",
    component: AdminPageComponent,
    children:[
      {
        path:'courses',
        loadComponent: () => import('./courses-management/courses-management.component').then(mod => mod.CoursesManagementComponent),
      },
      {
        path:'users',
        loadComponent: () => import('./users-management/users-management.component').then(mod => mod.UsersManagementComponent),
      }
    ]
  }
];
