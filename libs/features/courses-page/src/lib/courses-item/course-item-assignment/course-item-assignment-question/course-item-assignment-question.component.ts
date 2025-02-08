import { Component, Input } from '@angular/core';
import { Assignment, Question, QuestionType } from '@sp/core/models';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgDompurifyPipe } from "@taiga-ui/dompurify";
import {
  SingleChoiceQuestionComponent
} from '../../../questions/single-choice/single-choice-question/single-choice-question.component';

@Component({
  selector: 'sp-course-item-assignment-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgDompurifyPipe,
    SingleChoiceQuestionComponent,
  ],
  templateUrl: './course-item-assignment-question.component.html',
  styleUrl: './course-item-assignment-question.component.scss',
})
export class CourseItemAssignmentQuestionComponent {
  @Input() question!: Question;
  @Input() courseElement!: Assignment;

  questionTypes = QuestionType;

  isExpanded = false;
}
