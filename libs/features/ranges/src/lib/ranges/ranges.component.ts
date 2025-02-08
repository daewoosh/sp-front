import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, shareReplay, combineLatest, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from '../category-list/category-list.component';
import { RangeCategoryDto } from '@sp/core/models';
import { TuiLet } from '@taiga-ui/cdk';

@Component({
  selector: 'sp-ranges-page',
  standalone: true,
  imports: [CommonModule, CategoryListComponent, TuiLet],
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.scss'],
})
export class RangesComponent {
  public categories$: Observable<RangeCategoryDto[]>;

  public selectedBlindId$: Observable<number | null>;
  public selectedActionId$: Observable<number | null>;
  public selectedPositionId$: Observable<number | null>;

  public topLevelCategories$: Observable<RangeCategoryDto[]>;
  public actions$: Observable<RangeCategoryDto[]>;
  public positions$: Observable<RangeCategoryDto[]>;

  public table

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.categories$ = this.activatedRoute.data.pipe(
      map(({ categories }) => categories as RangeCategoryDto[]),
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
  }
}
