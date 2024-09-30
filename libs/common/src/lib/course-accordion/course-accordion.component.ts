import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TuiExpand, TuiExpandComponent } from "@taiga-ui/core";

@Component({
  selector: 'sp-course-accordion',
  templateUrl: './course-accordion.component.html',
  styleUrls: ['./course-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TuiExpandComponent, TuiExpand],
})
export class CourseAccordionComponent {

  @Input() index = 0;
  @Input() head = '';

  @Input() isOpened = false;
  @Input() isExpandable = true;

  @Input() fontSize = '1rem';

  toggle(): void {
    this.isOpened = !this.isOpened;
  }

}
