import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Assignment, CourseProgramItem } from "@sp/core/models";
import { CommonModule } from "@angular/common";
import {
  CourseItemAssignmentQuestionComponent
} from "./course-item-assignment-question/course-item-assignment-question.component";
import { RouterLink } from "@angular/router";
import { CoursesApiService } from "../../courses-api.service";

@Component({
  selector: 'sp-course-item-assignment',
  standalone: true,
  imports: [CommonModule, CourseItemAssignmentQuestionComponent, RouterLink],
  templateUrl: './course-item-assignment.component.html',
  styleUrl: './course-item-assignment.component.scss'
})
export class CourseItemAssignmentComponent {
  @Input() courseElement!: Assignment;
  @Input() courseProgram!: CourseProgramItem[];

  constructor(private coursesApiService: CoursesApiService,
              private cdr: ChangeDetectorRef) {
  }

  get showPrevBtn() {
    return this.courseElement.order > 1;
  }

  get showNextBtn() {
    return this.courseElement.order < this.courseProgram.length;
  }

  get canGoNext() {
    return this.courseElement.isCompleted;
  }

  sendAnswers() {
    this.coursesApiService.createUserAnswers(this.courseElement.id, this.courseElement.assignmentId, this.courseElement.questions)
      .subscribe(
        res => {
          this.courseElement.isCompleted = true;
          this.cdr.detectChanges();
        }
      );
  }
}
