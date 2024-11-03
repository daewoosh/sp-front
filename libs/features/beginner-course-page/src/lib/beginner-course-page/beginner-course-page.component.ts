import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeginnerTopComponent } from "../beginner-top/beginner-top.component";
import { WhyCourseComponent } from "../why-course/why-course.component";
import { ResultComponent } from "../result/result.component";
import { BeginnerDiagramComponent } from "../beginner-diagram/beginner-diagram.component";
import { BeginnerProgramComponent } from "../beginner-program/beginner-program.component";
import { BeginnerBonusesComponent } from "../beginner-bonuses/beginner-bonuses.component";
import { BeginnerPaymentFormComponent } from "../beginner-payment-form/beginner-payment-form.component";
import { LEAD_FORM_NAME } from '@sp/config';

@Component({
  selector: 'sp-front-beginner-course-page',
  standalone: true,
  imports: [CommonModule, BeginnerTopComponent, WhyCourseComponent, ResultComponent, BeginnerDiagramComponent, BeginnerProgramComponent, BeginnerBonusesComponent, BeginnerPaymentFormComponent],
  templateUrl: './beginner-course-page.component.html',
  styleUrl: './beginner-course-page.component.scss',
  providers: [{
    provide: LEAD_FORM_NAME,
    useValue: 'beginner'
  }]
})
export class BeginnerCoursePageComponent {}
