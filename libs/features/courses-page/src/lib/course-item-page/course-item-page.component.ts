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

  constructor(private coursesStateService: CoursesStateService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.courseProgram$ = this.coursesStateService.selectCourseProgram.pipe(
      tap(program=>{
        const currentOrder = this.activatedRoute.snapshot.firstChild?.paramMap.get('order');
        if (!currentOrder) {
          const firstIncomplete = program.find(item => !item.isCompleted);

          if (firstIncomplete) {
            this.router.navigate([firstIncomplete.order], { relativeTo: this.activatedRoute });
          }
        }
      })
    );
  }
}
