import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Course, CourseProgramItem } from '@sp/core/models';
import { delay, Observable, of, tap } from 'rxjs';
import { CourseProgramListComponent } from '../course-program-list/course-program-list.component';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';

@Component({
  selector: 'sp-course-item-page',
  standalone: true,
  imports: [CommonModule, CourseProgramListComponent, RouterOutlet],
  templateUrl: './course-item-page.component.html',
  styleUrl: './course-item-page.component.scss',
})
export class CourseItemPageComponent implements OnInit {
  courseProgram$: Observable<CourseProgramItem[]> = of([]);
  height$: Observable<number>;
  selectedCourse$: Observable<Course | undefined> = of(undefined);

  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  constructor(
    private coursesStateService: CoursesStateService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.height$ = this.coursesStateService.selectCourseItemHeight;
    this.selectedCourse$ = this.coursesStateService.selectSelectedCourse.pipe(
      tap(selectedCourse => {
        console.log(selectedCourse);
      })
    );
  }

  ngOnInit() {
    this.courseProgram$ = this.coursesStateService.selectCourseProgram.pipe(
      delay(200),
      tap((program) => {
        // debugger;
        const currentOrder =
          this.activatedRoute.snapshot.firstChild?.paramMap.get('order');
        if (!currentOrder) {
          let orderToNavigate = 1; // По умолчанию, если программа завершена или не найдены подходящие элементы

          const firstIncompletePurchased = program.find(
            (item) => !item.isCompleted && item.purchased
          );
          if (firstIncompletePurchased) {
            // Если есть незавершённый элемент, который приобретён
            orderToNavigate = firstIncompletePurchased.order;
          } else {
            // Если нет незавершённых приобретённых элементов, ищем последний завершённый
            const lastCompleted = [...program]
              .reverse()
              .find((item) => item.isCompleted);
            if (lastCompleted && lastCompleted.order !== program.length) {
              orderToNavigate = lastCompleted.order;
            }
          }

          // Навигация к вычисленному order
          this.router.navigate([orderToNavigate], {
            relativeTo: this.activatedRoute,
          });
        }
      })
    );
  }

  protected openFeedbackModal(course: Course) {
    this.dialogs
      .open<boolean>(
        new PolymorpheusComponent(FeedbackModalComponent, this.injector),
        {
          data: {
            course: course,
            // userName: course.userName,
          }, // Pass any data if needed
          dismissible: true,
          appearance: 'sp-modal',
        }
      )
      .subscribe();
  }
}
