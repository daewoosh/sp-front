import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../admin.api.service';
import { ClipboardModule } from 'ngx-clipboard';
import { TuiAlertService } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { APP_URL } from '@sp/config';

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
    { id: 4, name: 'Покерные ренджи' },
  ];

  createdLink = '';
  availableCourseItemsCount: number | null = null;
  selectedCourseId = 1;

  constructor(
    private adminApiService: AdminApiService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(APP_URL) private appUrl: string
  ) {}

  createAccessLink() {
    this.adminApiService
      .createCoursePurchaseRequest(this.selectedCourseId, this.availableCourseItemsCount)
      .subscribe((res) => {
        if (res) {
          this.createdLink = `${this.appUrl}/activateCourse/${res.token}`;
          this.availableCourseItemsCount = null;
        }
      });
  }

  copied() {
    this.alertService.open(`Скопировано в буфер обмена`).subscribe();
  }
}
