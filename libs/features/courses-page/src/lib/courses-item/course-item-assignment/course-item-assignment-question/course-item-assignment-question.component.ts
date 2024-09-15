import { Component, Input } from '@angular/core';
import { Assignment, Question } from "@sp/core/models";

@Component({
  selector: 'sp-course-item-assignment-question',
  standalone: true,
  imports: [],
  templateUrl: './course-item-assignment-question.component.html',
  styleUrl: './course-item-assignment-question.component.scss'
})
export class CourseItemAssignmentQuestionComponent {

  @Input() question!: Question;
  @Input() courseElement!: Assignment;
}
