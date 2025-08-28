import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RangeCategoryDto, RangeTableDto } from '../models';
import { Observable } from 'rxjs';
import { API_PATH } from '@sp/config';

@Injectable({ providedIn: 'root' })
export class RangesApiService {
  constructor(private http: HttpClient, @Inject(API_PATH) private apiPath: string) {}

  getRangesCategories():Observable<RangeCategoryDto[]>{
    return this.http.get<RangeCategoryDto[]>(`${this.apiPath}/ranges/categories`);
  }

  getTableDisplay(positionId:number):Observable<RangeTableDto>{
    return this.http.get<RangeTableDto>(`${this.apiPath}/ranges/table/${positionId}`);
  }
}
