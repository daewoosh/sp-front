import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { map, Observable } from "rxjs";
import { CoursesSidenavComponent } from "../courses-sidenav/courses-sidenav.component";
import { CoursesListComponent } from "../courses-list/courses-list.component";
import { RouterOutlet } from "@angular/router";
import { CoursesApiService } from "../courses-api.service";
import { Course } from "@sp/core/models";
import { FooterComponent } from "@sp/common/footer";
import { CoursesStateService } from "../courses-state.service";
import { CoursesResolver } from "../courses-resolver.service";
import { CourseAccessGuard } from "../courses-routes";

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
