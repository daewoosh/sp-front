import { map, of, switchMap, tap } from "rxjs";
import { Course, PagingResult } from "@sp/core/models";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { HttpClient } from "@angular/common/http";
import { ClientService } from '@sp/core/guards';

export function initializeApplication(clientService: ClientService,coursesStateService: CoursesStateService,http:HttpClient) {
  return (): any => {
    return clientService.checkAuthenticatedStatus().pipe(
      switchMap(isLoggedIn=>{
        if (isLoggedIn){
          return http.get<PagingResult<Course>>(`${API_URL}/courses`)
            .pipe(
              map(courses => courses.result),
              tap(courses => coursesStateService.setCourses(courses))
            );
        }else{
          return of([])
        }
      })
    );
  }
}

