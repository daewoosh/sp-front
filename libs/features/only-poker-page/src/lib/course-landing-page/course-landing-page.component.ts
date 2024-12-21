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
import { LEAD_FORM_NAME } from '@sp/config';
import { MainReviewComponent, Review } from '@sp/common';
import { reviews } from '../reviews';

@Component({
  selector: 'sp-course-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    CourseCabinetComponent,
    CourseCoachComponent,
    CourseEarnComponent,
    CourseForWhoComponent,
    CoursePaymentComponent,
    CoursePriceComponent,
    CourseProgramComponent,
    CourseTopComponent,
    MainReviewComponent,
  ],
  templateUrl: './course-landing-page.component.html',
  styleUrl: './course-landing-page.component.scss',
  providers: [
    {
      provide: LEAD_FORM_NAME,
      useValue: 'onlypokerpromo',
    },
  ],
})
export class CourseLandingPageComponent {
  public reviews: Review[] = reviews;
}
