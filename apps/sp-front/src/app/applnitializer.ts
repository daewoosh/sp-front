import { map, of, switchMap, tap } from "rxjs";
import { Course, PagingResult } from "@sp/core/models";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { HttpClient } from "@angular/common/http";
import { ClientService } from '@sp/core/guards';
import { AuthTokenStorageService } from '@sp/core/providers/auth-token-storage.service';

export function initializeApplication(clientService: ClientService,coursesStateService: CoursesStateService,http:HttpClient, authTokenStorage: AuthTokenStorageService) {
  return (): any => {
    // Cookie могла прийти от биржевого фронта с коротким Max-Age — закрепляем её как свою до первого запроса.
    authTokenStorage.adoptExistingToken();
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

