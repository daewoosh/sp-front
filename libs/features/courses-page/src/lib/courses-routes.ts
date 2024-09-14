import { Route } from "@angular/router";

export const coursesRoutes: Route[] = [
  {
    path: ":id/:order",
    loadComponent: () => import('./courses-item/courses-item.component').then(mod => mod.CoursesItemComponent),
  },
  {
    path: "",
    loadComponent: () => import('./courses-list/courses-list.component').then(mod => mod.CoursesListComponent),
    pathMatch: "full"
  },

];
