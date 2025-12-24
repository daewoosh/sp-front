import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiAlertService, TuiDialogContext } from '@taiga-ui/core';
import { BehaviorSubject, map, Observable, of, switchMap, take } from 'rxjs';
import { AppStateService } from '@sp/core/state';
import { Course, UserProfile } from '@sp/core/models';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoursesApiService } from '@sp/core/providers';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';

@Component({
  selector: 'sp-feedback-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss',
})
export class FeedbackModalComponent {
  private readonly context =
    injectContext<TuiDialogContext<string, { course: Course }>>();

  profile$: Observable<UserProfile>;
  course = this.context.data.course;

  form: FormGroup;
  protected isSubmitting$ = new BehaviorSubject<boolean>(false);
  promocode$ = new BehaviorSubject<string>('');
  maxLength = 1500;
  length$ = new BehaviorSubject<number>(0);
  constructor(
    private appStateService: AppStateService,
    private fb: FormBuilder,
    private coursesApiService: CoursesApiService,
    private coursesStateService: CoursesStateService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.profile$ = this.appStateService.selectUser.pipe(
      map((user) => {
        return {
          ...user,
        };
      })
    );

    this.form = this.fb.group({
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1500),
        ],
      ],
    });

    this.form.controls['comment'].valueChanges.subscribe((value) => {
      this.length$.next(value.length);
    });
  }

  onSend() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting$.next(true);
    // this.coursesStateService.selectCourses
    //   .pipe(
    //     take(1)
    //   )
    //   .subscribe((courses) => {
    //   const updatedCourses = courses.map((c) => {
    //     if (c.slug === this.course.slug) {
    //       return {
    //         ...c,
    //         hasPendingFeedback: false,
    //       };
    //     }
    //     return c;
    //   });
    //   this.coursesStateService.setCourses(updatedCourses);
    //   this.coursesStateService.setCurrentCourse(this.course.slug);
    // });

    this.coursesApiService
      .acceptFeedback(this.course.slug, this.form.value.comment.trim())
      .pipe(
        switchMap((res) => {
          this.promocode$.next(res.promocode);
          this.isSubmitting$.next(false);
          return this.coursesStateService.selectCourses;
        }),
        take(1),
      )
      .subscribe((courses) => {
        const updatedCourses = courses.map((c) => {
          if (c.slug === this.course.slug) {
            return {
              ...c,
              hasPendingFeedback: false,
            };
          }
          return c;
        });
        this.coursesStateService.setCourses(updatedCourses);
        this.coursesStateService.setCurrentCourse(this.course.slug);
      });
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation();
    }

    if (event.code === 'Space' || event.key === ' ') {
      const currentValue = this.form.get('comment')?.value || '';
      this.form.get('comment')?.setValue(currentValue + ' ');
    }
  }

  protected onClose() {
    this.context.completeWith('');
  }

  protected copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.alertService
      .open('Скопировано', { appearance: 'success', autoClose: 5000 })
      .subscribe();
  }
}
