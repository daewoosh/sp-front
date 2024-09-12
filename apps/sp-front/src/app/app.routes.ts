import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp-front/common";

const routes:Route[]=[
  {
    path:'',
    loadComponent: () => import('@sp/features/main-page').then(mod => mod.MainPageComponent),
  },
  {
    path:'bonus',
    loadComponent: () => import('@sp/bonuses-page').then(mod => mod.BonusesPageComponent),
  }
]

export const appRoutes: Route[] = [
  {
    path:'',
    component:PageLayoutComponent,
    children: routes
  }
];
