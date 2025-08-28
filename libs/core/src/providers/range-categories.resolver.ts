import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RangeCategoryDto } from '../models';
import { RangesApiService } from '../providers';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RangesCategoriesResolver implements Resolve<RangeCategoryDto[]> {
  constructor(private rangesApiService: RangesApiService) {}

  resolve(): Observable<RangeCategoryDto[]> {
    return this.rangesApiService.getRangesCategories();
  }
}

