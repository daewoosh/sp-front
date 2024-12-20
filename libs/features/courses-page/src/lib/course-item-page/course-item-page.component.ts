import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { CourseProgramItem } from "@sp/core/models";
import { Observable, of, tap } from "rxjs";
import { CourseProgramItemComponent } from "../course-program-item/course-program-item.component";
import { CourseProgramListComponent } from "../course-program-list/course-program-list.component";
import { TuiScrollbar } from "@taiga-ui/core";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";

@Component({
  selector: 'sp-course-item-page',
  standalone: true,
  imports: [CommonModule, CourseProgramItemComponent, CourseProgramListComponent, RouterOutlet, TuiScrollbar],
  templateUrl: './course-item-page.component.html',
  styleUrl: './course-item-page.component.scss',
})
export class CourseItemPageComponent implements OnInit {


  courseProgram$: Observable<CourseProgramItem[]> = of([]);
  height$: Observable<number>;

  constructor(private coursesStateService: CoursesStateService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.height$ = this.coursesStateService.selectCourseItemHeight;
  }

  ngOnInit() {
    this.courseProgram$ = this.coursesStateService.selectCourseProgram.pipe(
      tap(program => {
        const currentOrder = this.activatedRoute.snapshot.firstChild?.paramMap.get('order');
        if (!currentOrder) {
          let orderToNavigate = 1; // По умолчанию, если программа завершена или не найдены подходящие элементы

          const firstIncompletePurchased = program.find(item => !item.isCompleted && item.purchased);
          if (firstIncompletePurchased) {
            // Если есть незавершённый элемент, который приобретён
            orderToNavigate = firstIncompletePurchased.order;
          } else {
            // Если нет незавершённых приобретённых элементов, ищем последний завершённый
            const lastCompleted = [...program].reverse().find(item => item.isCompleted);
            if (lastCompleted && lastCompleted.order !== program.length) {
              orderToNavigate = lastCompleted.order;
            }
          }

          // Навигация к вычисленному order
          this.router.navigate([orderToNavigate], { relativeTo: this.activatedRoute });

        }
      })
    );
  }
}
