import { Component, Input } from '@angular/core';
import { Assignment, Question } from "@sp/core/models";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-course-item-assignment-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './course-item-assignment-question.component.html',
  styleUrl: './course-item-assignment-question.component.scss'
})
export class CourseItemAssignmentQuestionComponent {

  @Input() question!: Question;
  @Input() courseElement!: Assignment;
}
