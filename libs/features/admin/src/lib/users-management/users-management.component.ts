import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../admin.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCourseInfo } from '../models';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BaseListComponent } from '@sp/common';
import { AppStateService } from '@sp/core/state';
import { PagingResult } from '@sp/core/models';
import { Observable } from 'rxjs';
import { TuiAccordion } from '@taiga-ui/kit';
import { ProgressState } from '../models';

@Component({
  selector: 'sp-users-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiAccordion],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
})
export class UsersManagementComponent extends BaseListComponent<UserCourseInfo> {
  constructor(
    private adminApiService: AdminApiService,
    router: Router,
    route: ActivatedRoute,
    appStateService: AppStateService,
    fb: FormBuilder
  ) {
    super(router, route, appStateService, fb);
  }

  // Типы опций
  private readonly courseOptionsType!: { id: number; label: string };
  private readonly progressOptionType!: { value: ProgressState; label: string };

  // Опции для фильтров
  coursesOptions: Array<{ id: number; label: string }> = [
    { id: 1, label: 'Only Покер' },
    { id: 2, label: 'Осознанное начало' },
    { id: 3, label: 'Разбор базы' },
  ];

  progressOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: ProgressState.NotStarted },
    { value: 1, label: ProgressState.Active },
    { value: 2, label: ProgressState.Stuck },
    { value: 3, label: ProgressState.Completed },
  ];

  // Реализация абстрактного метода получения данных
  protected fetchData(filterQueryString: string, pageNumber: number, pageSize: number): Observable<PagingResult<UserCourseInfo>> {
    return this.adminApiService.getUsersList(filterQueryString, pageNumber, pageSize);
  }

  // Форма фильтра: search + courseId + progressState
  protected override buildFilterForm() {
    return this.fb.group({
      search: [''],
      courseId: [''],
      progressState: ['']
    });
  }

  protected override fillFormFromParams(params: Record<string, unknown>): void {
    const search = (params['search'] ?? params['tgName']) as string | undefined;
    const courseId = params['courseId'] as string | number | undefined;
    const progressState = params['progressState'] as string | undefined;

    const patch: Record<string, unknown> = {};
    if (search !== undefined) patch['search'] = search;
    if (courseId !== undefined) patch['courseId'] = courseId;
    if (progressState !== undefined) patch['progressState'] = progressState;

    if (Object.keys(patch).length) {
      this.filterForm.patchValue(patch, { emitEvent: false });
    }
  }

  protected override getDefaultFilters(): { search: string; courseId: string | number | ''; progressState: string } {
    return { search: '', courseId: '', progressState: '' };
  }

  applySearch() {
    this.applyFilters();
  }

  // Действия управления доступом
  toggleAccessState(courseId: number, userId: number) {
    const confirmed = confirm('Вы уверены?');
    if (confirmed) {
      this.adminApiService
        .toggleCourseAccess(courseId, userId)
        .subscribe({ next: () => { this.applyFilters(); } });
    }
  }

  grantFullAccess(courseId: number, userId: number) {
    const confirmed = confirm('Выдать полный доступ к курсу?');
    if (confirmed) {
      this.adminApiService
        .grantCourseAccess(courseId, userId, null)
        .subscribe({ next: () => { this.applyFilters(); } });
    }
  }

  grantAccess(courseId: number, userId: number, value: string) {
    const confirmed = confirm(`Выдать доступ к ${value} урокам?`);
    if (confirmed) {
      this.adminApiService
        .grantCourseAccess(courseId, userId, +value)
        .subscribe({ next: () => { this.applyFilters(); } });
    }
  }
}
