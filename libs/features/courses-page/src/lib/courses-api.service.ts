import { Inject, Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { Course, CourseElement, CourseProgramItem, PagingResult } from "@sp/core/models";
import { ASSIGNMENT_COURSE_ELEMENT, COURSE_PROGRAM, VIDEO_COURSE_ELEMENT } from "./courses-mock";
import { API_PATH } from "@sp/config";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CoursesApiService {

  constructor(@Inject(API_PATH) private apiPath: string,
              private http: HttpClient) {
  }

  getCourses(): Observable<PagingResult<Course>> {
    return this.http.get<PagingResult<Course>>(`${this.apiPath}/courses`);
    // return of(COURSES);
  }

  getCourseProgram(slug: string): Observable<CourseProgramItem[]> {
    return this.http.get<PagingResult<CourseProgramItem>>(`${this.apiPath}/courses/${slug}/CourseElements/ReadAll`).pipe(
      map(courses => courses.result)
    );
    // return of(COURSE_PROGRAM);
  }

  getCourseElement(slug: string, order: number): Observable<CourseElement> {
    if (order % 2 === 0) {
      return of(ASSIGNMENT_COURSE_ELEMENT);
    }
    return of(VIDEO_COURSE_ELEMENT);
  }
}

