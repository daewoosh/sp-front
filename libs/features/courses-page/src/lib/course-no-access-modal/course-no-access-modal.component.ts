import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectContext } from "@taiga-ui/polymorpheus";
import { TuiDialogContext } from "@taiga-ui/core";

@Component({
  selector: 'sp-course-no-access-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-no-access-modal.component.html',
  styleUrl: './course-no-access-modal.component.scss',
})
export class CourseNoAccessModalComponent {
  private readonly context = injectContext<TuiDialogContext<boolean>>();

  go(){
    this.context.completeWith(true)
  }
}
