import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RangeTableDto } from '../models';
import { RangesApiService } from '../providers';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DefaultRangeTableResolver implements Resolve<RangeTableDto> {
  constructor(private rangesApiService: RangesApiService) {
  }

  resolve(): Observable<RangeTableDto> {
    return this.rangesApiService.getTableDisplay(-1);
  }
}
