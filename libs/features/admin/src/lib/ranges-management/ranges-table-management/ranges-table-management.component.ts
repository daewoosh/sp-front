import { Component } from '@angular/core';
import { map, Observable, share } from 'rxjs';
import { EditTableData, RangeTableData } from '@sp/core/models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectShowLoader } from '@sp/core/store/application';
import { CommonModule } from '@angular/common';
import { RangesTableEditComponent } from './ranges-table-edit/ranges-table-edit.component';

@Component({
  selector: 'sp-ranges-table-management',
  standalone: true,
  imports: [CommonModule, RangesTableEditComponent],
  templateUrl: './ranges-table-management.component.html',
  styleUrl: './ranges-table-management.component.scss',
})
export class RangesTableManagementComponent {
  public tableData$: Observable<RangeTableData>;
  public editPath$:Observable<string>;
  public isLoading$: Observable<boolean>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {
    this.isLoading$ = this.store.select(selectShowLoader);

    this.tableData$ = this.activatedRoute.data.pipe(
      map(({ tableData = {} }) => tableData as EditTableData),
      map((data)=> data.table),
      share()
    );

    this.editPath$ = this.activatedRoute.data.pipe(
      map(({ tableData = {} }) => tableData as EditTableData),
      map((data)=> data.path),
      share()
    );
  }
}
