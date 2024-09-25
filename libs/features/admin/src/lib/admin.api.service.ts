import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CoursePurchaseRequest } from "./models";

@Injectable()
export class AdminApiService{
  constructor(private http: HttpClient) {
  }

  createCoursePurchaseRequest(courseId:number):Observable<CoursePurchaseRequest>{
    return this.http.post<CoursePurchaseRequest>(`${API_URL}/admin/createCoursePurchaseRequest`, {courseId});
  }
}
