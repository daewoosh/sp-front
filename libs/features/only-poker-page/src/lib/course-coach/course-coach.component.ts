import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-course-coach',
  templateUrl: './course-coach.component.html',
  styleUrls: ['./course-coach.component.scss'],
  standalone: true,
    imports: [CommonModule, RouterLink]
})
export class CourseCoachComponent {}
