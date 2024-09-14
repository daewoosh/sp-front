import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { BitrateOptions, IMediaElement, VgApiService, VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { HttpClient } from "@angular/common/http";
import { take, throttleTime } from "rxjs";
import { CoursesSidenavComponent } from "../courses-sidenav/courses-sidenav.component";
import { COURSES } from "../courses-mock";
import { CoursesListComponent } from "../courses-list/courses-list.component";
import { RouterOutlet } from "@angular/router";
import { CoursesApiService } from "../courses-api.service";

@Component({
  selector: 'sp-front-courses-page',
  standalone: true,
  imports: [CommonModule, VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule, CoursesSidenavComponent, CoursesListComponent, RouterOutlet],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.scss',
  providers:[CoursesApiService]
})
export class CoursesPageComponent {
  courses = COURSES
}
