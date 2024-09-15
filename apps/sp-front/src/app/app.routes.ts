import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp/common";
import { coursesRoutes } from "@sp/courses-page";

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
        path: "advanced",
        loadComponent: () => import('@sp/advanced-course-page').then(mod => mod.AdvancedCoursePageComponent),
      },
      {
        path: "beginner",
        loadComponent: () => import('@sp/beginner-course-page').then(mod => mod.BeginnerCoursePageComponent),
      },
      {
        path: "analysis",
        loadComponent: () => import('@sp/analysis-page').then(mod => mod.AnalysisPageComponent),
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
