import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ProgramSubItemComponent } from "./program-sub-item/program-sub-item.component";
import { CourseAccordionComponent } from "@sp/common/course-accordion";
import { WatchVideoComponent } from "@sp/common/watch-video/watch-video.component";

@Component({
  selector: 'sp-advanced-program',
  templateUrl: './advanced-program.component.html',
  styleUrls: ['./advanced-program.component.scss'],
  standalone: true,
  imports: [CommonModule, CourseAccordionComponent, ProgramSubItemComponent, WatchVideoComponent]
})
export class AdvancedProgramComponent {}
