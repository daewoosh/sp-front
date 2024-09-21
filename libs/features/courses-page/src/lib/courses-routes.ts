import { Route } from "@angular/router";
import { CourseProgramResolver, CoursesResolver } from "./courses-resolver.service";

export const coursesRoutes: Route[] = [
  {
    path:"",
    resolve: {CoursesResolver},
    children:[
      {
        path: ":id",
        loadComponent: () => import('./course-item-page/course-item-page.component').then(mod => mod.CourseItemPageComponent),
        resolve: {CourseProgramResolver},
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
    ]
  },
];
