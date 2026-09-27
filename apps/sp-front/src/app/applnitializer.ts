import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Course, PagingResult } from "@sp/core/models";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { HttpClient } from "@angular/common/http";
import { ClientService } from '@sp/core/guards';
import { AuthTokenStorageService } from '@sp/core/providers/auth-token-storage.service';

export function initializeApplication(clientService: ClientService,coursesStateService: CoursesStateService,http:HttpClient, authTokenStorage: AuthTokenStorageService) {
  return (): any => {
    // Cookie могла прийти от биржевого фронта с коротким Max-Age — закрепляем её как свою до первого запроса.
    authTokenStorage.adoptExistingToken();
    return adoptSessionFromOtherSubdomain(http, authTokenStorage).pipe(
      switchMap(() => clientService.checkAuthenticatedStatus()),
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

/**
 * Вход был на другом поддомене: своей cookie `authToken` нет, но бэкенд обменника выставил общий
 * признак сессии — тихий refresh (HttpOnly refresh-cookie тоже общая) выдаёт токен и здесь.
 * Интерцептор так не умеет: анонимные запросы он сознательно не обновляет. Неудача — просто гость.
 */
function adoptSessionFromOtherSubdomain(http: HttpClient, authTokenStorage: AuthTokenStorageService): Observable<unknown> {
  if (authTokenStorage.getToken() || !authTokenStorage.hasSessionMarker()) {
    return of(null);
  }
  return http.post<{ accessToken?: string }>(`${AUTH_URL}/auth/refresh`, {}, { withCredentials: true }).pipe(
    tap(result => {
      if (result.accessToken) {
        authTokenStorage.setToken(result.accessToken);
      }
    }),
    catchError(() => of(null))
  );
}

