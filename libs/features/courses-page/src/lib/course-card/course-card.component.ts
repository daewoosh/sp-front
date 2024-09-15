import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from "@sp/core/models";
import { RouterLink } from "@angular/router";
import { TuiDialogContext, TuiDialogService } from "@taiga-ui/core";

@Component({
  selector: 'sp-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  @Input() course!: Course;

  constructor(private dialogs: TuiDialogService) {
  }

  protected showDialog(content: any): void {
    this.dialogs.open(content, {appearance: 'sp-modal',}).subscribe();
  }
}
