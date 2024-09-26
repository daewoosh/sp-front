import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, UserProfile } from "@sp/core/models";
import { CourseCardComponent } from "../course-card/course-card.component";
import { COURSES } from "../courses-mock";
import { AppStateService } from "@sp/core/state";
import { Observable } from "rxjs";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";

@Component({
  selector: 'sp-courses-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
})
export class CoursesListComponent {
  profile$: Observable<UserProfile>;
  courses$: Observable<Course[]>;

  constructor(coursesState: CoursesStateService,
              appStateService: AppStateService) {
    this.courses$ = coursesState.selectCourses;
    this.profile$ = appStateService.selectUser
  }
}
