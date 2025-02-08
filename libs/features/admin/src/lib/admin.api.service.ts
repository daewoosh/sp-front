import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { CoursePurchaseRequest, UserCourseInfo } from './models';
import { PagingResult, RangeTableData } from '@sp/core/models';

@Injectable()
export class AdminApiService{
  constructor(private http: HttpClient) {
  }

  createCoursePurchaseRequest(courseId:number,availableCourseItemsCount: number|null):Observable<CoursePurchaseRequest>{
    return this.http.post<CoursePurchaseRequest>(`${API_URL}/admin/createCoursePurchaseRequest`, {courseId,availableCourseItemsCount});
  }

  // Получение списка пользователей с курсами
  getUsers(params: { page: number; pageSize: number }): Observable<PagingResult<UserCourseInfo>> {
    let queryParameters = new HttpParams;

      queryParameters = queryParameters.set('pageNumber', params.page);
      queryParameters = queryParameters.set('pageSize', params.pageSize);


    return this.http.get<PagingResult<UserCourseInfo>>(`${API_URL}/admin/users?${queryParameters}`);
  }

  // Поиск пользователя по TelegramName
  findUser(query: string): Observable<UserCourseInfo> {
    return this.http.get<UserCourseInfo>(`${API_URL}/admin/users/${query}`);
  }

  // Предоставление доступа к курсу (ко всему или заданному количеству уроков)
  grantCourseAccess(courseId: number, userId: number, count?:number|null): Observable<void> {
    return this.http.post<void>(`${API_URL}/admin/users/grantCourseAccess`, { courseId, userId, count  });
  }

  // Переключение состояния доступа к курсу
  toggleCourseAccess(courseId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${API_URL}/admin/users/toggleCourseAccess`, { courseId, userId  });
  }

  getTableForEdit(actionId: number):Observable<RangeTableData>{
    return this.http.get<RangeTableData>(`${API_URL}/admin/ranges/table?actionId=${actionId}`);
  }

  saveTable(actionId:number, tableData: RangeTableData):Observable<void>{
    return this.http.post<void>(`${API_URL}/admin/ranges/table`, {data: tableData,actionId});
  }
}
