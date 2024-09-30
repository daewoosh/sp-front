import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-course-top',
  templateUrl: './course-top.component.html',
  styleUrls: ['./course-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class CourseTopComponent {

}
