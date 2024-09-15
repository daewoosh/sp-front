import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ListItemWithDotComponent } from "@sp/common/list-item-with-dot";


@Component({
  selector: 'sp-bonus-item-course',
  templateUrl: './bonus-item-course.component.html',
  styleUrls: ['./bonus-item-course.component.scss'],
  standalone: true,
  imports: [CommonModule, ListItemWithDotComponent],
})
export class BonusItemCourseComponent {}
