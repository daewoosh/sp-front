import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RangeCategoryDto, RangeTableDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RangesApiService {
  constructor(private http: HttpClient) {}

  getRangesCategories():Observable<RangeCategoryDto[]>{
    return this.http.get<RangeCategoryDto[]>(`${API_URL}/ranges/categories`);
  }

  getTableDisplay(positionId:number):Observable<RangeTableDto>{
    return this.http.get<RangeTableDto>(`${API_URL}/ranges/table/${positionId}`);
  }
}
