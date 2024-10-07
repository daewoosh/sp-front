import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCabinetComponent } from "../course-cabinet/course-cabinet.component";
import { CourseCoachComponent } from "../course-coach/course-coach.component";
import { CourseEarnComponent } from "../course-earn/course-earn.component";
import { CourseForWhoComponent } from "../course-for-who/course-for-who.component";
import { CoursePaymentComponent } from "../course-payment/course-payment.component";
import { CoursePriceComponent } from "../course-price/course-price.component";
import { CourseProgramComponent } from "../course-program/course-program.component";
import { CourseTopComponent } from "../course-top/course-top.component";

@Component({
  selector: 'sp-course-landing-page',
  standalone: true,
    imports: [CommonModule, CourseCabinetComponent, CourseCoachComponent, CourseEarnComponent, CourseForWhoComponent, CoursePaymentComponent, CoursePriceComponent, CourseProgramComponent, CourseTopComponent],
  templateUrl: './course-landing-page.component.html',
  styleUrl: './course-landing-page.component.scss',
})
export class CourseLandingPageComponent {}
