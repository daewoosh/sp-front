import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedTopComponent } from "../advanced-top/advanced-top.component";
import { AdvancedAboutComponent } from "../advanced-about/advanced-about.component";
import { AdvancedWhyComponent } from "../advanced-why/advanced-why.component";
import { AdvancedCardsComponent } from "../advanced-cards/advanced-cards.component";
import { AdvancedProgramComponent } from "../advanced-programm/advanced-program.component";
import { AdvancedResultsComponent } from "../advanced-results/advanced-results.component";
import { AdvancedBonusesComponent } from "../advanced-bonuses/advanced-bonuses.component";
import { AdvancedPaymentFormComponent } from "../advanced-payment-form/advanced-payment-form.component";
import { LEAD_FORM_NAME } from '@sp/config';

@Component({
  selector: 'sp-front-advanced-course-page',
  standalone: true,
  imports: [CommonModule, AdvancedTopComponent, AdvancedAboutComponent, AdvancedWhyComponent, AdvancedCardsComponent, AdvancedProgramComponent, AdvancedResultsComponent, AdvancedBonusesComponent, AdvancedPaymentFormComponent],
  templateUrl: './advanced-course-page.component.html',
  styleUrl: './advanced-course-page.component.scss',
  providers: [{
    provide: LEAD_FORM_NAME,
    useValue: 'advanced'
  }]
})
export class AdvancedCoursePageComponent {}
