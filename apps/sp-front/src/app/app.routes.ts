import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp/common";
import { coursesRoutes } from "../../../../libs/features/courses-page/src/lib/courses-routes";

export const appRoutes: Route[] = [
  {
    path: "",
    component: PageLayoutComponent,
    children: [
      {
        path: "bonus",
        loadComponent: () => import('@sp/bonuses-page').then(mod => mod.BonusesPageComponent),
      },
      {
        path: "bonus",
        loadComponent: () => import('@sp/bonuses-page').then(mod => mod.BonusesPageComponent),
      },
      {
        path: "advanced-course",
        loadComponent: () => import('@sp/advanced-course-page').then(mod => mod.AdvancedCoursePageComponent),
      },
      {
        path: "beginner-course",
        loadComponent: () => import('@sp/beginner-course-page').then(mod => mod.BeginnerCoursePageComponent),
      },
      {
        path: "courses",
        loadComponent: () => import('@sp/courses-page').then(mod => mod.CoursesPageComponent),
        children: coursesRoutes
      },
      {
        path: "",
        loadComponent: () => import('@sp/main-page').then(mod => mod.MainPageComponent),
        pathMatch: 'full'
        // component: MainPageComponent
      }]
  }
];
