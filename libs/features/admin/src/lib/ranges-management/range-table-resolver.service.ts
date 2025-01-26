import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { RangeTableData } from '@sp/core/models';
import { AdminApiService } from '../admin.api.service';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setShowLoader } from '@sp/core/store/application';

@Injectable()
export class RangeTableResolver implements Resolve<RangeTableData> {
  constructor(private adminApiService: AdminApiService, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RangeTableData> {
    this.store.dispatch(setShowLoader({ showLoader: true }));
    const actionId = route.paramMap.get('actionId') ?? 0;
    return this.adminApiService
      .getTableForEdit(+actionId)
      .pipe(
        tap(() => this.store.dispatch(setShowLoader({ showLoader: false })))
      );
  }
}
