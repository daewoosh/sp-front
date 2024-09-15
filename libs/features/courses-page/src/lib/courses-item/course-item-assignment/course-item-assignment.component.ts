import { Component, Input } from '@angular/core';
import { Assignment } from "@sp/core/models";
import { CommonModule } from "@angular/common";
import {
  CourseItemAssignmentQuestionComponent
} from "./course-item-assignment-question/course-item-assignment-question.component";

@Component({
  selector: 'sp-course-item-assignment',
  standalone: true,
  imports: [CommonModule, CourseItemAssignmentQuestionComponent],
  templateUrl: './course-item-assignment.component.html',
  styleUrl: './course-item-assignment.component.scss'
})
export class CourseItemAssignmentComponent {
  @Input() courseElement!: Assignment;
}
