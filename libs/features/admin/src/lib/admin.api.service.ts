import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { CoursePurchaseRequest, UserCourseInfo } from './models';
import { EditTableData, PagingResult, RangeTableData } from '@sp/core/models';
import { API_PATH } from '@sp/config';

@Injectable()
export class AdminApiService{
  constructor(private http: HttpClient, @Inject(API_PATH) private apiPath: string) {
  }

  createCoursePurchaseRequest(courseId:number,availableCourseItemsCount: number|null):Observable<CoursePurchaseRequest>{
    return this.http.post<CoursePurchaseRequest>(`${this.apiPath}/admin/createCoursePurchaseRequest`, {courseId,availableCourseItemsCount});
  }

  // Получение списка пользователей с курсами
  getUsers(params: { page: number; pageSize: number }): Observable<PagingResult<UserCourseInfo>> {
    let queryParameters = new HttpParams;

      queryParameters = queryParameters.set('pageNumber', params.page);
      queryParameters = queryParameters.set('pageSize', params.pageSize);


    return this.http.get<PagingResult<UserCourseInfo>>(`${this.apiPath}/admin/users?${queryParameters}`);
  }

  // Поиск пользователя по TelegramName
  findUser(query: string): Observable<UserCourseInfo> {
    return this.http.get<UserCourseInfo>(`${this.apiPath}/admin/users/${query}`);
  }

  // Предоставление доступа к курсу (ко всему или заданному количеству уроков)
  grantCourseAccess(courseId: number, userId: number, count?:number|null): Observable<void> {
    return this.http.post<void>(`${this.apiPath}/admin/users/grantCourseAccess`, { courseId, userId, count  });
  }

  // Переключение состояния доступа к курсу
  toggleCourseAccess(courseId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiPath}/admin/users/toggleCourseAccess`, { courseId, userId  });
  }

  getTableForEdit(positionId: number):Observable<EditTableData>{
    return this.http.get<EditTableData>(`${this.apiPath}/admin/ranges/table?actionId=${positionId}`);
  }

  saveTable(positionId:number, tableData: RangeTableData):Observable<void>{
    return this.http.post<void>(`${this.apiPath}/admin/ranges/table`, {data: tableData,positionId});
  }
}
