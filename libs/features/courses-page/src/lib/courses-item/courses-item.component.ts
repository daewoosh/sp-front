import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { CoursesApiService } from "../courses-api.service";
import { Assignment, CourseElement, VideoCourseElement } from "@sp/core/models";
import { map, Observable, switchMap } from "rxjs";
import { CourseItemVideoComponent } from "./course-item-video/course-item-video.component";
import { CourseItemAssignmentComponent } from "./course-item-assignment/course-item-assignment.component";

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


  constructor(private activatedRoute: ActivatedRoute,
              private coursesApiService: CoursesApiService) {
  }

  ngOnInit() {
    this.courseElement$ = this.activatedRoute.paramMap
      .pipe(
        map(paramMap => {
          const slug = paramMap.get('id');
          const order = Number(paramMap.get('order')); // Явное приведение к числу
          return { slug, order }; // Возвращаем объект с правильным типом
        }),
        switchMap(data => {
          // Явно типизируем аргумент в switchMap для лучшей читаемости
          const slug = data.slug!;
          const order = data.order!;
          return this.coursesApiService.getCourseElement(slug, order);
        })
      );
  }

  videoElement(element: CourseElement):VideoCourseElement{
    return element as VideoCourseElement;
  }

  assignmentElement(element: CourseElement):Assignment{
    return element as Assignment;
  }
}
