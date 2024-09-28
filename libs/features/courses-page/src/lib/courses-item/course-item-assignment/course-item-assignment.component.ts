import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { Assignment, CourseElementType, CourseProgramItem } from "@sp/core/models";
import { CommonModule } from "@angular/common";
import {
  CourseItemAssignmentQuestionComponent
} from "./course-item-assignment-question/course-item-assignment-question.component";
import { RouterLink } from "@angular/router";
import { CoursesApiService } from "@sp/core/providers/courses-api.service";
import { TuiAlertService } from "@taiga-ui/core";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";

@Component({
  selector: 'sp-course-item-assignment',
  standalone: true,
  imports: [CommonModule, CourseItemAssignmentQuestionComponent, RouterLink],
  templateUrl: './course-item-assignment.component.html',
  styleUrl: './course-item-assignment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseItemAssignmentComponent implements OnInit {
  @Input() courseElement!: Assignment;
  @Input() courseProgram!: CourseProgramItem[];

  isResetMode = false;

  constructor(private coursesApiService: CoursesApiService,
              private cdr: ChangeDetectorRef,
              @Inject(TuiAlertService)
              private readonly alertService: TuiAlertService,
              private coursesStateService: CoursesStateService) {
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

  get nextButtonLabel(){
    //order идет с 1 поэтому используем order
    if (this.courseProgram[this.courseElement.order] && this.courseProgram[this.courseElement.order].type === CourseElementType.Video){
      return 'Перейти к следующему уроку';
    }
    if (this.courseProgram[this.courseElement.order] && this.courseProgram[this.courseElement.order].type === CourseElementType.Assignment){
      return 'Перейти к домашнему заданию';
    }
    return 'Далее';
  }

  ngOnInit() {
    const allAnswersEmpty = (this.courseElement as Assignment).questions.every(question =>
      !question.userAnswer || question.userAnswer.trim() === ''
    );

    this.isResetMode = this.courseElement.isCompleted && allAnswersEmpty;
  }

  sendAnswers() {
    const hasEmptyAnswers = this.courseElement.questions.some(question => !question.userAnswer || question.userAnswer.trim() === '');
    if (hasEmptyAnswers){
      this.alertService.open('Необходимо заполнить ответы на все вопросы', {appearance: 'error'}).subscribe();
      return;
    }
    this.coursesApiService.createUserAnswers(this.courseElement.id, this.courseElement.assignmentId, this.courseElement.questions)
      .subscribe(
        res => {
          this.courseElement.isCompleted = true;
          this.isResetMode = false;
          this.alertService.open('Ваши ответы сохранены', {appearance: 'success'}).subscribe();
          this.coursesStateService.completeItem(this.courseElement.order);
          this.cdr.detectChanges();
        }
      );
  }

  resetAnswers() {
    this.coursesApiService.clearUserAnswers(this.courseElement.id, this.courseElement.assignmentId)
      .subscribe(_ => {
        this.isResetMode = true;
        this.courseElement.questions.forEach(question => {
          question.userAnswer = '';
        });
        this.cdr.detectChanges();
      })
  }
}
