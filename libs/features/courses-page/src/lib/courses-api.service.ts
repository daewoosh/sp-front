import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Course, CourseElement, CourseProgramItem } from "@sp/core/models";
import { ASSIGNMENT_COURSE_ELEMENT, COURSE_PROGRAM, COURSES, VIDEO_COURSE_ELEMENT } from "./courses-mock";

@Injectable()
export class CoursesApiService {

  getCourses(): Observable<Course[]> {
    return of(COURSES);
  }

  getCourseProgram(slug: string): Observable<CourseProgramItem[]> {
    return of(COURSE_PROGRAM);
  }

  getCourseElement(slug: string, order: number): Observable<CourseElement> {
    if (order % 2 ===0){
      return of(ASSIGNMENT_COURSE_ELEMENT);
    }
    return of(VIDEO_COURSE_ELEMENT);
  }
}
