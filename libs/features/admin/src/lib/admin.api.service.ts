import { Inject, Injectable } from "@angular/core";
import { API_PATH } from "@sp/config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CoursePurchaseRequest } from "./models";

@Injectable()
export class AdminApiService{
  constructor(@Inject(API_PATH) private apiPath: string,
              private http: HttpClient) {
  }

  createCoursePurchaseRequest(courseId:number):Observable<CoursePurchaseRequest>{
    return this.http.post<CoursePurchaseRequest>(`${this.apiPath}/admin/createCoursePurchaseRequest`, {courseId});
  }
}
