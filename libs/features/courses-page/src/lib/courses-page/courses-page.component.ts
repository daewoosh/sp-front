import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { Observable } from "rxjs";
import { CoursesListComponent } from "../courses-list/courses-list.component";
import { RouterOutlet } from "@angular/router";
import { Course } from "@sp/core/models";
import { FooterComponent } from "@sp/common/footer";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import { CourseAccessGuard } from "../courses-routes";
import { CoursesSidenavComponent } from "@sp/common/courses-sidenav";

@Component({
  selector: 'sp-front-courses-page',
  standalone: true,
  imports: [CommonModule, VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule, CoursesSidenavComponent, CoursesListComponent, RouterOutlet, FooterComponent],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.scss',
  providers:[CourseAccessGuard]
})
export class CoursesPageComponent {
  courses$: Observable<Course[]>;

  constructor(coursesState: CoursesStateService) {
    this.courses$ = coursesState.selectCourses;
  }
}
