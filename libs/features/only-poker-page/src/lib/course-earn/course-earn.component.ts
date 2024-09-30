import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-course-earn',
  templateUrl: './course-earn.component.html',
  styleUrls: ['./course-earn.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class CourseEarnComponent {}
