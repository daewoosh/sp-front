import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Course } from "@sp/core/models";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { map, Observable, of, switchMap, take, tap } from "rxjs";
import { CoursesApiService } from "@sp/core/providers/courses-api.service";

@Injectable({providedIn: 'root'})
export class CoursesResolver implements Resolve<Course[]> {
  constructor(private coursesApiService: CoursesApiService,
              private coursesStateService: CoursesStateService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course[]> {
    return this.coursesStateService.selectCourses.pipe(
      take(1),
      switchMap(courses => {
        if (courses.length) {
          return of(courses);
        }
        return this.coursesApiService.getCourses().pipe(
          map(response => response.result),
          tap(courses => this.coursesStateService.setCourses(courses))
        );
      })
    );
  }
}

