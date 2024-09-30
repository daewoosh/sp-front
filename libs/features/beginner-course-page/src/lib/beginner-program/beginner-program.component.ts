import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CourseAccordionComponent } from "@sp/common/course-accordion";
import { WatchVideoComponent } from "@sp/common/watch-video/watch-video.component";

@Component({
  selector: 'sp-beginner-program',
  templateUrl: './beginner-program.component.html',
  styleUrls: ['./beginner-program.component.scss'],
  standalone: true,
  imports: [CommonModule, CourseAccordionComponent, WatchVideoComponent]
})
export class BeginnerProgramComponent {}
