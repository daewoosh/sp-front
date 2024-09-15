import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CourseAccordionComponent } from "@sp/common/course-accordion";

@Component({
  selector: 'sp-course-program',
  templateUrl: './course-program.component.html',
  styleUrls: ['./course-program.component.scss'],
  standalone: true,
  imports: [CommonModule, CourseAccordionComponent]
})
export class CourseProgramComponent {}
