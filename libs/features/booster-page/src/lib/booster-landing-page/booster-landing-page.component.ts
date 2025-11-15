import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoosterAccordionComponent } from "../booster-accordion/booster-accordion.component";
import { BoosterGraphComponent } from "../booster-graph/booster-graph.component";
import { BoosterMiddleComponent } from "../booster-middle/booster-middle.component";
import { BoosterPaymentComponent } from "../booster-payment/booster-payment.component";
import { BoosterPlanComponent } from "../booster-plan/booster-plan.component";
import { BoosterTopComponent } from "../booster-top/booster-top.component";
import { LEAD_FORM_NAME } from '@sp/config';
import { BoosterVariantsComponent } from '../booster-variants/booster-variants.component';

@Component({
  selector: 'sp-booster-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    BoosterAccordionComponent,
    BoosterGraphComponent,
    BoosterMiddleComponent,
    BoosterPaymentComponent,
    BoosterPlanComponent,
    BoosterTopComponent,
    BoosterVariantsComponent,
  ],
  templateUrl: './booster-landing-page.component.html',
  styleUrl: './booster-landing-page.component.scss',
  providers: [
    {
      provide: LEAD_FORM_NAME,
      useValue: 'boosterpromo',
    },
  ],
})
export class BoosterLandingPageComponent {}
