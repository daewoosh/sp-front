import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTopComponent } from "../course-top/course-top.component";
import { CourseForWhoComponent } from "../course-for-who/course-for-who.component";
import { CourseEarnComponent } from "../course-earn/course-earn.component";
import { CourseProgramComponent } from "../course-program/course-program.component";
import { CourseCabinetComponent } from "../course-cabinet/course-cabinet.component";
import { CourseCoachComponent } from "../course-coach/course-coach.component";
import { CoursePriceComponent } from "../course-price/course-price.component";
import { CoursePaymentComponent } from "../course-payment/course-payment.component";
import { LEAD_FORM_NAME } from '@sp/config';
import { MainReviewComponent, Review } from '@sp/common';
import { reviews } from '../reviews';

@Component({
  selector: 'sp-only-poker-page',
  standalone: true,
  imports: [
    CommonModule,
    CourseTopComponent,
    CourseForWhoComponent,
    CourseEarnComponent,
    CourseProgramComponent,
    CourseCabinetComponent,
    CourseCoachComponent,
    CoursePriceComponent,
    CoursePaymentComponent,
    MainReviewComponent,
  ],
  templateUrl: './only-poker-page.component.html',
  styleUrl: './only-poker-page.component.scss',
  providers: [
    {
      provide: LEAD_FORM_NAME,
      useValue: 'onlypoker',
    },
  ],
})
export class OnlyPokerPageComponent {
  @Input() showOtherProducts = true;

  public reviews: Review[] = reviews;
}
