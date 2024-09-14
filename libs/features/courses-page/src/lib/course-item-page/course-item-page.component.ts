import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sp-course-item-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-item-page.component.html',
  styleUrl: './course-item-page.component.scss',
})
export class CourseItemPageComponent {
  constructor() {
  }
}
