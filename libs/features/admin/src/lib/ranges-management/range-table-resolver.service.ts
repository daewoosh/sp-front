import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EditTableData } from '@sp/core/models';
import { AdminApiService } from '../admin.api.service';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setShowLoader } from '@sp/core/store/application';

@Injectable()
export class RangeTableResolver implements Resolve<EditTableData> {
  constructor(private adminApiService: AdminApiService, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<EditTableData> {
    this.store.dispatch(setShowLoader({ showLoader: true }));
    const positionId = route.paramMap.get('positionId') ?? 0;
    return this.adminApiService
      .getTableForEdit(+positionId)
      .pipe(
        tap(() => this.store.dispatch(setShowLoader({ showLoader: false })))
      );
  }
}
