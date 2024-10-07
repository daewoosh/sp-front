import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { Assignment, CourseElement, CourseProgramItem, VideoCourseElement } from "@sp/core/models";
import { map, Observable, tap } from "rxjs";
import { CourseItemVideoComponent } from "./course-item-video/course-item-video.component";
import { CourseItemAssignmentComponent } from "./course-item-assignment/course-item-assignment.component";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";

@Component({
  selector: 'sp-courses-item',
  standalone: true,
  imports: [CommonModule, CourseItemVideoComponent, CourseItemAssignmentComponent],
  templateUrl: './courses-item.component.html',
  styleUrl: './courses-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesItemComponent implements OnInit {

  courseElement$!: Observable<CourseElement>;
  @ViewChild('coursesItem') coursesItemElement!: ElementRef;

  courseElements$: Observable<CourseProgramItem[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private coursesStateService: CoursesStateService) {
    this.courseElements$ = this.coursesStateService.selectCourseProgram.pipe(
      tap(program => {
      })
    );
  }

  ngOnInit() {

    this.courseElement$ = this.activatedRoute.data.pipe(
      tap(_ => {
        setTimeout(() => {
          const height = this.coursesItemElement.nativeElement.offsetHeight;
          this.coursesStateService.setCourseItemHeight(height);
        }, 500);
      }),
      map(data => data['item']),
    );
  }


  videoElement(element: CourseElement): VideoCourseElement {
    return element as VideoCourseElement;
  }

  assignmentElement(element: CourseElement): Assignment {
    return element as Assignment;
  }
}
