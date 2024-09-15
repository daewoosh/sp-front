import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTopComponent } from "../course-top/course-top.component";
import { CourseForWhoComponent } from "../course-for-who/course-for-who.component";
import { CourseEarnComponent } from "../course-earn/course-earn.component";
import { CourseProgramComponent } from "../course-program/course-program.component";
import { CourseCabinetComponent } from "../course-cabinet/course-cabinet.component";
import { CourseCoachComponent } from "../course-coach/course-coach.component";
import { CoursePriceComponent } from "../course-price/course-price.component";
import { CoursePaymentComponent } from "../course-payment/course-payment.component";

@Component({
  selector: 'lib-only-poker-page',
  standalone: true,
  imports: [CommonModule, CourseTopComponent, CourseForWhoComponent, CourseEarnComponent, CourseProgramComponent, CourseCabinetComponent, CourseCoachComponent, CoursePriceComponent, CoursePaymentComponent],
  templateUrl: './only-poker-page.component.html',
  styleUrl: './only-poker-page.component.scss',
})
export class OnlyPokerPageComponent {}
