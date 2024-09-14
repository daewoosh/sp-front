import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, UserProfile } from "@sp/core/models/user-profile";
import { CourseCardComponent } from "../course-card/course-card.component";
import { COURSES } from "../courses-mock";

@Component({
  selector: 'sp-courses-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
})
export class CoursesListComponent {
  @Input() profile?: UserProfile;
  @Input() courses: Course[] = COURSES;
}
