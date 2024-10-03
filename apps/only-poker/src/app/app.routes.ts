import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path:"agreement",
    loadComponent: () => import('@sp/agreement-page').then(mod => mod.AgreementPageComponent),
  },
  {
    path:"",
    pathMatch:"full",
    loadComponent: () => import('@sp/only-poker-page').then(mod => mod.CourseLandingPageComponent),
  }
];
