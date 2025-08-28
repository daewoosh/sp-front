import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, of, shareReplay, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from '../category-list/category-list.component';
import { RangeCategoryDto, RangeTableDto } from '@sp/core/models';
import { TuiLet } from '@taiga-ui/cdk';
import { RangeTableDisplayComponent } from '../range-table-display/range-table-display.component';
import { RangesApiService } from '@sp/core/providers';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'sp-ranges-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    TuiLet,
    RangeTableDisplayComponent,
  ],
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.scss'],
})
export class RangesComponent {
  public categories$: Observable<RangeCategoryDto[]>;
  public defaultRangeTable$: Observable<RangeTableDto>;
  public selectedRangeTable$: Observable<RangeTableDto | null> = of(null);

  public selectedBlindId$: Observable<number | null>;
  public selectedActionId$: Observable<number | null>;
  public selectedPositionId$: Observable<number | null>;

  public topLevelCategories$: Observable<RangeCategoryDto[]>;
  public actions$: Observable<RangeCategoryDto[]>;
  public positions$: Observable<RangeCategoryDto[]>;

  //public table

  constructor(
    private activatedRoute: ActivatedRoute,
    private rangesApiService: RangesApiService,

  ) {
    this.categories$ = this.activatedRoute.data.pipe(
      map(({ categories }) => categories as RangeCategoryDto[]),
      shareReplay(1)
    );

    this.defaultRangeTable$ = this.activatedRoute.data.pipe(
      map(({ defaultRangeTable }) => defaultRangeTable as RangeTableDto),
      shareReplay(1)
    );

    // Чтение параметров из роута
    this.selectedBlindId$ = this.activatedRoute.queryParams.pipe(
      map((params) => (params['blind'] ? +params['blind'] : null)),
      shareReplay(1)
    );

    this.selectedActionId$ = this.activatedRoute.queryParams.pipe(
      map((params) => (params['action'] ? +params['action'] : null)),
      shareReplay(1)
    );

    this.selectedPositionId$ = this.activatedRoute.queryParams.pipe(
      map((params) => (params['position'] ? +params['position'] : null)),
      tap((position) => {
        if (position) {
          this.selectedRangeTable$ =
            this.rangesApiService.getTableDisplay(position);
        } else {
          this.selectedRangeTable$ = this.defaultRangeTable$;
        }
      }),
      shareReplay(1)
    );

    // Получение данных для каждого уровня
    this.topLevelCategories$ = this.categories$.pipe(
      map((categories) => categories.filter((cat) => cat.level === 1)),
      shareReplay(1)
    );

    this.actions$ = combineLatest([
      this.topLevelCategories$,
      this.selectedBlindId$,
    ]).pipe(
      map(([categories, blindId]) =>
        blindId
          ? categories.find((cat) => cat.id === blindId)?.children ?? []
          : categories[0].children
      ),
      shareReplay(1)
    );

    this.positions$ = combineLatest([
      this.actions$,
      this.selectedActionId$,
    ]).pipe(
      map(([categories, actionId]) =>
        actionId
          ? categories.find((cat) => cat.id === actionId)?.children ?? []
          : categories[0].children
      ),
      shareReplay(1)
    );
  }

  onBlindSelected(blindId: number): void {
    // Логика обработки выбора уровня "Blinds Count"
  }

  onActionSelected(actionId: number): void {
    // Логика обработки выбора уровня "Range Action"
  }

  onPositionSelected(positionId: number): void {
    // Логика обработки выбора уровня "Range Position"
    this.selectedRangeTable$ =
      this.rangesApiService.getTableDisplay(positionId);
  }


}
