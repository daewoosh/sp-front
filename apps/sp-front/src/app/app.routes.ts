import { Route } from '@angular/router';
import { PageLayoutComponent } from "@sp/common";

export const appRoutes: Route[] = [
  {
    path: "",
    component: PageLayoutComponent,
    children:[{
      path:"",
      loadComponent: () => import('@sp/main-page').then(mod => mod.MainPageComponent),
      pathMatch: 'full'
      // component: MainPageComponent
    }]
  }
];
