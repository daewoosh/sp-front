import { Route } from "@angular/router";

export const coursesRoutes: Route[] = [
  {
    path: ":id",
    loadComponent: () => import('./course-item-page/course-item-page.component').then(mod => mod.CourseItemPageComponent),
    children: [{
      path: ":order",
      loadComponent: () => import('./courses-item/courses-item.component').then(mod => mod.CoursesItemComponent),
    }]
  },
  {
    path: "",
    loadComponent: () => import('./courses-list/courses-list.component').then(mod => mod.CoursesListComponent),
    pathMatch: "full"
  },

];
