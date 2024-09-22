import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Course } from "@sp/core/models";
import { CoursesStateService } from "./courses-state.service";
import { map, tap } from "rxjs";
import { CoursesApiService } from "./courses-api.service";

@Injectable({providedIn: 'root'})
export class CoursesResolver implements Resolve<Course[]> {
  constructor(private coursesApiService: CoursesApiService,
              private coursesStateService: CoursesStateService) {
  }

  resolve() {
    return this.coursesApiService.getCourses().pipe(
      map(courses => courses.result),
      tap(courses => this.coursesStateService.setCourses(courses))
    );
  }
}

