import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, filter, Observable, Subject} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { PagingResult, UserRole } from '@sp/core/models';
import { AppStateService } from '@sp/core/state';

@Directive()
export abstract class BaseListComponent<T> implements OnInit, OnDestroy {
  @Input() userId?: string;
  @Input() isAdmin?: boolean = false;

  // Форма для фильтров
  public filterForm: FormGroup;

  // Текущая страница пагинации
  private currentPage = 0;
  protected pageSize = 20;

  // Флаг загрузки данных
  public loading$ = new BehaviorSubject<boolean>(false);

  // Список элементов
  protected itemsSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.itemsSubject.asObservable();

  // Флаг возможности загрузить больше данных
  private hasMoreItemsSubject = new BehaviorSubject<boolean>(true);
  public hasMoreItems$ = this.hasMoreItemsSubject.asObservable();

  // Фильтр запроса
  private queryFilterSubject = new BehaviorSubject<string>('');
  private queryFilter$ = this.queryFilterSubject.asObservable();

  // Сабджект для отписки при уничтожении компонента
  private destroy$ = new Subject<void>();

  public currentUserId = '';
  role: UserRole = UserRole.User;

  protected constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected appStateService: AppStateService,
    protected fb: FormBuilder
  ) {
    this.filterForm = this.buildFilterForm();
    this.appStateService.userState
      .pipe(
        filter((res) => !!res?.user),
        map((res) => ({id: res.user!.id, role: res.user!.role}))
      )
      .subscribe((res) => {
        this.currentUserId = res.id;
        this.role = res.role;
      });
  }

  ngOnInit() {
    // Подписываемся на изменения URL параметров
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        tap(params => {
          // Заполняем форму значениями из URL
          this.fillFormFromParams(params);
        }),
        map(params => this.createFilterQueryString(params)),
        distinctUntilChanged()
      )
      .subscribe(filterQueryString => {
        // Сбрасываем пагинацию и элементы
        this.resetPagination();

        // Устанавливаем новый фильтр запроса
        this.queryFilterSubject.next(filterQueryString);
      });

    // Инициализируем загрузку данных при изменении фильтра
    this.queryFilter$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.loading$.next(true)),
        switchMap(filterQueryString => this.fetchData(filterQueryString, this.currentPage, this.pageSize))
      )
      .subscribe({
        next: (result) => {
          this.itemsSubject.next(result.result);
          this.hasMoreItemsSubject.next(result.result.length < result.totalCount);
          this.loading$.next(false);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.loading$.next(false);
        }
      });

    const queryParamsLength = Object.keys(this.route.snapshot.queryParams).length;
    // Проверяем наличие параметров в URL, если их нет - применяем дефолтные фильтры
    if (queryParamsLength === 0 || (queryParamsLength === 1 && this.route.snapshot.queryParams['selectedTab'])) {
      const defaultFilters = this.getDefaultFilters();
      if (defaultFilters && Object.keys(defaultFilters).length > 0) {
        this.applyFilters(defaultFilters);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get isAdminView(): boolean {
    return (this.role === UserRole.Admin || this.role === UserRole.Support) && !!this.userId;
  }


  // Метод для применения фильтров
  public applyFilters(values?: any): void {
    const filterValues = values || this.filterForm.value;

    // Ключи, относящиеся к форме
    const formKeys = Object.keys(this.filterForm.controls);

    // Текущие параметры URL
    const currentParams = { ...this.route.snapshot.queryParams } as any;

    // Сохраняем только те параметры, которых нет среди ключей формы
    const preservedParams: any = {};
    Object.keys(currentParams).forEach(key => {
      if (!formKeys.includes(key)) {
        preservedParams[key] = currentParams[key];
      }
    });

    // Очищаем пустые значения формы
    const cleanedFormParams = this.cleanEmptyParams(filterValues);

    // Формируем итоговый набор параметров: сохраненные + параметры формы
    const nextParams = { ...preservedParams, ...cleanedFormParams };

    // Обновляем URL без merge, чтобы удалить устаревшие параметры формы
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: nextParams
    });
  }

  // Метод для загрузки следующей страницы данных
  public loadMore(): void {
    if (this.loading$.value || !this.hasMoreItemsSubject.value) {
      return;
    }

    this.currentPage++;
    this.loading$.next(true);

    this.fetchData(this.queryFilterSubject.value, this.currentPage, this.pageSize)
      .subscribe({
        next: (result) => {
          // Добавляем новые элементы к существующим
          const currentItems = this.itemsSubject.value;
          this.itemsSubject.next([...currentItems, ...result.result]);

          // Проверяем, есть ли ещё элементы для загрузки
          const totalLoaded = this.itemsSubject.value.length;
          this.hasMoreItemsSubject.next(totalLoaded < result.totalCount);
          this.loading$.next(false);
        },
        error: (error) => {
          console.error('Error loading more data:', error);
          this.loading$.next(false);
        }
      });
  }

  // Метод для сброса пагинации
  private resetPagination(): void {
    this.currentPage = 0;
    this.itemsSubject.next([]);
    this.hasMoreItemsSubject.next(true);
  }

  // Метод для создания строки запроса из параметров
  private createFilterQueryString(params: any): string {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return queryParams.toString();
  }

  // Метод для очистки пустых параметров
  private cleanEmptyParams(params: any): any {
    const result: any = {};

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        result[key] = params[key];
      }
    });

    return result;
  }

  // Абстрактные методы, которые должны быть реализованы в наследниках

  // Метод для заполнения формы из параметров URL
  protected fillFormFromParams(params: any): void {
    // do nothing
  };

  // Метод для получения фильтров по умолчанию
  protected getDefaultFilters(): any {
    return {};
  };


  // Метод для загрузки данных с сервера
  protected abstract fetchData(filterQueryString: string, pageNumber: number, pageSize: number): Observable<PagingResult<T>>;

  protected buildFilterForm(): FormGroup {
    return this.fb.group({});
  }
}
