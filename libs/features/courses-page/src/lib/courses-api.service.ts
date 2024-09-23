import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Course, CourseElement, CourseProgramItem, PagingResult, Question } from "@sp/core/models";
import { API_PATH } from "@sp/config";
import { HttpClient } from "@angular/common/http";
import { CourseActivationService } from "@sp/core/providers";

@Injectable({providedIn: 'root'})
export class CoursesApiService extends CourseActivationService{

  constructor(@Inject(API_PATH) private apiPath: string,
              private http: HttpClient) {
    super();
  }

  override activateCourse(token:string): Observable<{wasAdded:boolean}>{
    return this.http.post<{wasAdded:boolean}>(`${this.apiPath}/courses/activate`, {token});
  }

  getCourses(): Observable<PagingResult<Course>> {
    return this.http.get<PagingResult<Course>>(`${this.apiPath}/courses`);
  }

  getCourseProgram(slug: string): Observable<CourseProgramItem[]> {
    return this.http.get<PagingResult<CourseProgramItem>>(`${this.apiPath}/courses/${slug}/CourseElements/ReadAll`).pipe(
      map(courses => courses.result)
    );
  }

  getCourseElement(slug: string, order: number): Observable<CourseElement> {
    return this.http.get<CourseElement>(`${this.apiPath}/courses/${slug}/${order}`);
  }

  updateVideoProgress(courseElementId: number, videoContentId: number, lastPosition: number): Observable<any> {
    return this.http.post(`${this.apiPath}/courseElements/${courseElementId}/videoContent/${videoContentId}/update`, {lastPosition});
  }

  completeVideo(courseElementId: number, videoContentId: number): Observable<any> {
    return this.http.post(`${this.apiPath}/courseElements/${courseElementId}/videoContent/${videoContentId}/complete`, {completed: true});
  }

  createUserAnswers(courseElementId: number, assignmentId: number, questions: Question[]): Observable<any> {
    const request = questions.map(q => {
      return {questionId: q.id, userAnswer: q.userAnswer}
    });
    return this.http.post(`${this.apiPath}/courseElements/${courseElementId}/assignments/${assignmentId}/createUserAnswers`, request);
  }

  clearUserAnswers(courseElementId: number, assignmentId: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/courseElements/${courseElementId}/assignments/${assignmentId}/clearUserAnswers`);
  }
}

