import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CourseAccordionComponent } from "@sp/common/course-accordion";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-booster-accordion',
  templateUrl: './booster-accordion.component.html',
  styleUrls: ['./booster-accordion.component.scss'],
  standalone: true,
  imports: [CommonModule, CourseAccordionComponent, RouterLink]
})
export class BoosterAccordionComponent {
}
