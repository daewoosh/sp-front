import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '@sp/common';
import { CourseFeedbackDto, UserCourseInfo } from '../models';
import { AdminApiService } from '../admin.api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStateService } from '@sp/core/state';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PagingResult } from '@sp/core/models';

@Component({
  selector: 'sp-feedbacks-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './feedbacks-page.component.html',
  styleUrl: './feedbacks-page.component.scss',
})
export class FeedbacksPageComponent extends BaseListComponent<CourseFeedbackDto> {
  constructor(
    private adminApiService: AdminApiService,
    router: Router,
    route: ActivatedRoute,
    appStateService: AppStateService,
    fb: FormBuilder
  ) {
    super(router, route, appStateService, fb);
  }

  // Опции для фильтров
  coursesOptions: Array<{ id: number; label: string }> = [
    { id: 1, label: 'Only Покер' },
    { id: -1, label: 'Only Покер (беспл.)' },
    { id: 2, label: 'Осознанное начало' },
    { id: 3, label: 'Разбор базы' },
  ];

  // Реализация абстрактного метода получения данных
  protected fetchData(
    filterQueryString: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PagingResult<CourseFeedbackDto>> {
    return this.adminApiService.getFeedbacks(
      filterQueryString,
      pageNumber,
      pageSize
    );
  }

  // Форма фильтра: search + courseId + progressState
  protected override buildFilterForm() {
    return this.fb.group({
      courseId: [''],
    });
  }

  protected override fillFormFromParams(params: Record<string, unknown>): void {
    const courseId = params['courseId'] as string | number | undefined;
    const patch: Record<string, unknown> = {};
    if (courseId !== undefined) patch['courseId'] = courseId;

    if (Object.keys(patch).length) {
      this.filterForm.patchValue(patch, { emitEvent: false });
    }
  }

  protected override getDefaultFilters(): {
    courseId: string | number | '';
  } {
    return { courseId: '' };
  }
}
