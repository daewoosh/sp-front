import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  INJECTOR,
  Input,
  OnInit,
} from '@angular/core';
import {
  Assignment,
  CourseElementType,
  CourseProgramItem,
  QuestionType,
} from '@sp/core/models';
import { CommonModule } from '@angular/common';
import { CourseItemAssignmentQuestionComponent } from './course-item-assignment-question/course-item-assignment-question.component';
import { RouterLink } from '@angular/router';
import { CoursesApiService } from '@sp/core/providers/courses-api.service';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { ResetModalComponent } from './reset-modal/reset-modal.component';

@Component({
  selector: 'sp-course-item-assignment',
  standalone: true,
  imports: [CommonModule, CourseItemAssignmentQuestionComponent, RouterLink],
  templateUrl: './course-item-assignment.component.html',
  styleUrl: './course-item-assignment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseItemAssignmentComponent {
  @Input() courseElement!: Assignment;
  @Input() courseProgram!: CourseProgramItem[];
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private readonly dialog = this.dialogs.open<boolean>(
    new PolymorpheusComponent(ResetModalComponent, this.injector),
    {
      dismissible: true,
      appearance: 'sp-modal',
    }
  );

  constructor(
    private coursesApiService: CoursesApiService,
    private cdr: ChangeDetectorRef,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private coursesStateService: CoursesStateService
  ) {}

  get showPrevBtn() {
    return this.courseElement.order > 1;
  }

  get showNextBtn() {
    return this.courseElement.order < this.courseProgram.length;
  }

  get canGoNext() {
    const nextElement = this.courseProgram[this.courseElement.order];
    return this.courseElement.isCompleted && nextElement?.purchased;
  }

  get nextButtonLabel() {
    //order идет с 1 поэтому используем order
    const nextElement = this.courseProgram[this.courseElement.order];
    if (nextElement && nextElement.type === CourseElementType.Video) {
      return 'Перейти к следующему уроку';
    }
    if (nextElement && nextElement.type === CourseElementType.Assignment) {
      return 'Перейти к домашнему заданию';
    }
    return 'Далее';
  }


  sendAnswers() {
    // Подготовка данных для отправки
    const formattedAnswers = this.courseElement.questions.map((question) => ({
      id: question.id,
      userAnswer:
        question.type === QuestionType.Text
          ? typeof question.userAnswer === 'string'
            ? question.userAnswer
            : '' // Обычный текст
          : JSON.stringify(
              Array.isArray(question.userAnswer) ? question.userAnswer : []
            ), // JSON массив для тестов
    }));
    console.log({ formattedAnswers });
    const hasEmptyAnswers = this.courseElement.questions.some((question) =>
      question.type === QuestionType.Text
        ? !question.userAnswer ||
          (typeof question.userAnswer === 'string' &&
            question.userAnswer.trim() === '')
        : !question.userAnswer ||
          (Array.isArray(question.userAnswer) &&
            question.userAnswer.length === 0)
    );

    if (hasEmptyAnswers) {
      this.alertService
        .open('Необходимо заполнить ответы на все вопросы', {
          appearance: 'error',
        })
        .subscribe();
      return;
    }


    this.coursesApiService
      .createUserAnswers(
        this.courseElement.id,
        this.courseElement.assignmentId,
        // @ts-ignore
        formattedAnswers
      )
      .subscribe((res: Assignment) => {
        if (res.isCompleted) {
          this.courseElement.isCompleted = true;

          this.alertService
            .open('Ваши ответы сохранены', { appearance: 'success' })
            .subscribe();
          this.coursesStateService.completeItem(this.courseElement.order, res.isCourseFinished);
        }else{
          this.alertService
            .open('Имеются ошибки в ответах. Пожалуйста, перепройдите тест.', { appearance: 'accent' })
            .subscribe();
        }
        // Обновляем вопросы с новыми данными (пометками верных/неверных)
        this.courseElement.questions = res.questions;
        this.courseElement.answersSaved = true;
        this.cdr.detectChanges();
      });
  }

  resetAnswers() {
    this.dialog.subscribe({
      next: (reset) => {
        if (reset) {
          this.coursesApiService
            .clearUserAnswers(
              this.courseElement.id,
              this.courseElement.assignmentId
            )
            .subscribe((res) => {
              this.courseElement = res;
              this.cdr.detectChanges();
            });
        }
      },
    });
  }
}
