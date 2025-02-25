import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp/common";
import { coursesRoutes } from "@sp/courses-page";
import { AdminGuard, AuthGuard } from "@sp/core/guards";
import { adminRoutes } from "@sp/admin";
import { publicationsRoutes } from "@sp/publications";

export const appRoutes: Route[] = [
  {
    path: "",
    component: PageLayoutComponent,
    children: [
      {
        path: "bonus",
        loadComponent: () => import('@sp/bonuses-page').then(mod => mod.BonusesPageComponent),
      },
      // {
      //   path: "advanced",
      //   loadComponent: () => import('@sp/advanced-course-page').then(mod => mod.AdvancedCoursePageComponent),
      // },
      {
        path: "beginner",
        loadComponent: () => import('@sp/beginner-course-page').then(mod => mod.BeginnerCoursePageComponent),
      },
      {
        path: "analysis",
        loadComponent: () => import('@sp/analysis-page').then(mod => mod.AnalysisPageComponent),
      },
      {
        path: "only-poker",
        loadComponent: () => import('@sp/only-poker-page').then(mod => mod.OnlyPokerPageComponent),
      },
      {
        path: "courses",
        canActivate: [AuthGuard],
        loadComponent: () => import('@sp/courses-page').then(mod => mod.CoursesPageComponent),
        children: coursesRoutes,
      },
      {
        path: "admin",
        canActivate: [AdminGuard],
        children: adminRoutes,
      },
      {
        path: "booster",
        loadComponent: () => import('@sp/booster-page').then(mod => mod.BoosterPageComponent),
      },
      {
        path: "logout",
        loadComponent: () => import('@sp/common').then(mod => mod.LogoutComponent),
      },
      {
        path: "activateCourse/:token",
        loadComponent: () => import('@sp/courses-page').then(mod => mod.ActivateCourseComponent),
      },
      {
        path:"login",
        loadComponent: () => import('@sp/common').then(mod => mod.OneTimeLoginComponent),
      },
      {
        path:"agreement",
        loadComponent: () => import('@sp/agreement-page').then(mod => mod.AgreementPageComponent),
      },
      {
        path:"articles",
        children:publicationsRoutes,
      },
      {
        path: "",
        loadComponent: () => import('@sp/main-page').then(mod => mod.MainPageComponent),
        pathMatch: 'full'
        // component: MainPageComponent
      }]
  }
];
