import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesApiService } from "../courses-api.service";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { CourseProgramItem } from "@sp/core/models";
import { map, Observable, of, switchMap } from "rxjs";
import { CourseProgramItemComponent } from "../course-program-item/course-program-item.component";
import { CourseProgramListComponent } from "../course-program-list/course-program-list.component";
import { TuiScrollbar } from "@taiga-ui/core";

@Component({
  selector: 'sp-course-item-page',
  standalone: true,
  imports: [CommonModule, CourseProgramItemComponent, CourseProgramListComponent, RouterOutlet, TuiScrollbar],
  templateUrl: './course-item-page.component.html',
  styleUrl: './course-item-page.component.scss',
})
export class CourseItemPageComponent implements OnInit {


  courseProgram$: Observable<CourseProgramItem[]> = of([]);

  constructor(private coursesApiService: CoursesApiService,
              private activatedRoute: ActivatedRoute,
              private router:Router) {
  }

  ngOnInit() {
    this.courseProgram$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.coursesApiService.getCourseProgram(id!))
    );
  }
}
