import { Component, Inject } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { AdminApiService } from "../admin.api.service";
import { ClipboardModule } from "ngx-clipboard";
import { TuiAlertService, TuiDataList } from "@taiga-ui/core";
import { TuiDataListWrapper } from "@taiga-ui/kit";
import { FormsModule } from '@angular/forms';

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'sp-courses-management',
  standalone: true,
  imports: [
    CommonModule,
    ClipboardModule,
    TuiDataList,
    TuiDataListWrapper,
    FormsModule,
  ],
  templateUrl: './courses-management.component.html',
  styleUrl: './courses-management.component.scss',
})
export class CoursesManagementComponent {
  courses: Course[] = [{ id: 1, name: 'Only Poker' }];

  createdLink = '';
  availableCourseItemsCount: number | null = null;

  constructor(
    private adminApiService: AdminApiService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  createAccessLink() {
    this.adminApiService.createCoursePurchaseRequest(1, this.availableCourseItemsCount).subscribe((res) => {
      if (res) {
        this.createdLink = `${APP_URL}/activateCourse/${res.token}`;
        this.availableCourseItemsCount = null;
      }
    });
  }

  copied() {
    this.alertService.open(`Скопировано в буфер обмена`).subscribe();
  }
}
