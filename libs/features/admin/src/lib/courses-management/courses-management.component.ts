import { Component } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { AdminApiService } from "../admin.api.service";

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'sp-courses-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-management.component.html',
  styleUrl: './courses-management.component.scss',
})
export class CoursesManagementComponent {
  courses: Course[] = [
    {id: 1, name: 'Only Poker'},
  ]

  createdLink = '';

  constructor(private adminApiService: AdminApiService,
              private locationStrategy: LocationStrategy) {
  }

  createAccessLink() {
    this.adminApiService.createCoursePurchaseRequest(1).subscribe(
      res => {
        if (res) {
          this.createdLink = `${this.locationStrategy.getBaseHref()}/activateCourse/${res.token}`;
        }
      }
    );
  }
}
