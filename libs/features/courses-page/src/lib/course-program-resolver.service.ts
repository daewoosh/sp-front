import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { CourseElement, CourseProgramItem } from "@sp/core/models";
import { CoursesApiService } from "./courses-api.service";
import { CoursesStateService } from "./courses-state.service";
import { map, Observable, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class CourseProgramResolver implements Resolve<CourseProgramItem[]> {
  constructor(private coursesApiService: CoursesApiService,
              private coursesStateService: CoursesStateService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CourseProgramItem[]> {
    const courseId = route.paramMap.get('id');
    const currentOrder = route.firstChild?.paramMap.get('order');

    return this.coursesApiService.getCourseProgram(courseId!).pipe(
      map(program => {
        if (!currentOrder) {
          // Находим первый элемент программы, у которого isCompleted = false
          const firstIncomplete = program.find(item => !item.isCompleted);
          if (firstIncomplete) {
            firstIncomplete.isCurrent = true;
          }
        } else {
          const currentOrderNumber = Number(currentOrder);
          const currentItem = program.find(item => item.order === currentOrderNumber);
          if (currentItem) {
            currentItem.isCurrent = true;
          }
        }
        return program;
      }),
      tap(program => this.coursesStateService.setCourseProgram(program))
    );
  }
}

@Injectable({providedIn: 'root'})
export class CourseElementResolver{

  constructor(private coursesApiService: CoursesApiService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CourseElement>{
    const courseId = route.parent?.paramMap.get('id');
    const order = route.paramMap.get('order');

    return this.coursesApiService.getCourseElement(courseId!, Number(order)) ;
  }
}
