import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../admin.api.service';
import { ClipboardModule } from 'ngx-clipboard';
import { TuiAlertService } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'sp-courses-management',
  standalone: true,
  imports: [CommonModule, ClipboardModule, FormsModule],
  templateUrl: './courses-management.component.html',
  styleUrl: './courses-management.component.scss',
})
export class CoursesManagementComponent {
  courses: Course[] = [
    { id: 1, name: 'Only Poker' },
    { id: 2, name: 'Осознанное начало' },
  ];

  createdLink = '';
  availableCourseItemsCount: number | null = null;
  selectedCourseId = 1;

  constructor(
    private adminApiService: AdminApiService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  createAccessLink() {
    this.adminApiService
      .createCoursePurchaseRequest(this.selectedCourseId, this.availableCourseItemsCount)
      .subscribe((res) => {
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
