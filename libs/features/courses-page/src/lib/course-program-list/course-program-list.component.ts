import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseProgramItem } from "@sp/core/models";
import { CourseProgramItemComponent } from "../course-program-item/course-program-item.component";
import { TuiScrollbar } from "@taiga-ui/core";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { Observable } from "rxjs";

@Component({
  selector: 'sp-course-program-list',
  standalone: true,
  imports: [CommonModule, CourseProgramItemComponent, TuiScrollbar],
  templateUrl: './course-program-list.component.html',
  styleUrl: './course-program-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseProgramListComponent {
  @Input() program: CourseProgramItem[] = [];
  height$: Observable<number>;
  constructor(private coursesStateService: CoursesStateService) {
    this.height$ = this.coursesStateService.selectCourseItemHeight;
  }

  get completedCount(): number {
    return this.program.filter(x => x.isCompleted).length;
  }
}
