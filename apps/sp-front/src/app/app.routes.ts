import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp-front/common";

const routes:Route[]=[
  {
    path:'bonus',
    loadComponent: () => import('@sp/bonuses-page').then(mod => mod.BonusesPageComponent),
  },
  {
    path:'',
    loadComponent: () => import('@sp/features/main-page').then(mod => mod.MainPageComponent),
    pathMatch: 'full'
  },
]

export const appRoutes: Route[] = [
  {
    path:'',
    component:PageLayoutComponent,
    children: routes,
  }
];
