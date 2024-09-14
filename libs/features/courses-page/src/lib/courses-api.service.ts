import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Course, CourseProgramItem } from "@sp/core/models/user-profile";
import { COURSE_PROGRAM, COURSES } from "./courses-mock";

@Injectable()
export class CoursesApiService {

  getCourses(): Observable<Course[]> {
    return of(COURSES);
  }

  getCourseProgram(slug: string): Observable<CourseProgramItem[]> {
    return of(COURSE_PROGRAM);
  }
}
