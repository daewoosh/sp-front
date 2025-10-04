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

  // Реализация абстрактного метода получения данных
  protected fetchData(filterQueryString: string, pageNumber: number, pageSize: number): Observable<PagingResult<UserCourseInfo>> {
    return this.adminApiService.getUsersList(filterQueryString, pageNumber, pageSize);
  }

  // Форма фильтра: единственное поле search
  protected override buildFilterForm() {
    return this.fb.group({
      search: ['']
    });
  }

  protected override fillFormFromParams(params: any): void {
    const search = params['search'] ?? params['tgName'];
    if (search !== undefined) {
      this.filterForm.patchValue({ search }, { emitEvent: false });
    }
  }

  protected override getDefaultFilters(): any {
    return { search: '' };
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
