import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoosterTopComponent } from "../booster-top/booster-top.component";
import { BoosterPlanComponent } from "../booster-plan/booster-plan.component";
import { BoosterAccordionComponent } from "../booster-accordion/booster-accordion.component";
import { BoosterGraphComponent } from "../booster-graph/booster-graph.component";
import { BoosterMiddleComponent } from "../booster-middle/booster-middle.component";
import { BoosterPaymentComponent } from "../booster-payment/booster-payment.component";
import { LEAD_FORM_NAME } from '@sp/config';

@Component({
  selector: 'sp-booster-page',
  standalone: true,
  imports: [CommonModule, BoosterTopComponent, BoosterPlanComponent, BoosterAccordionComponent, BoosterGraphComponent, BoosterMiddleComponent, BoosterPaymentComponent],
  templateUrl: './booster-page.component.html',
  styleUrl: './booster-page.component.scss',
  providers: [{
    provide: LEAD_FORM_NAME,
    useValue: 'booster'
  }]
})
export class BoosterPageComponent {
  @Input() showOtherProducts = true;
}
