import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseElementType, CourseProgramItem } from "@sp/core/models/";
import { RouterLink } from "@angular/router";
import { TuiProgress } from "@taiga-ui/kit";

@Component({
  selector: 'sp-course-program-item',
  standalone: true,
  imports: [CommonModule, RouterLink, TuiProgress],
  templateUrl: './course-program-item.component.html',
  styleUrl: './course-program-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseProgramItemComponent {
  @Input() item!: CourseProgramItem;
  @Input() currentElementOrder: number = 0;

  elementTypes= CourseElementType;

  get isCurrent(): boolean {
    return this.item.order == this.currentElementOrder;
  }
}
