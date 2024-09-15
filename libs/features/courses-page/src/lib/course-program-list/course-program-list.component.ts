import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseProgramItem } from "@sp/core/models";
import { CourseProgramItemComponent } from "../course-program-item/course-program-item.component";
import { TuiScrollbar } from "@taiga-ui/core";

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

  get completedCount(): number {
    return this.program.filter(x => x.isCompleted).length;
  }
}
