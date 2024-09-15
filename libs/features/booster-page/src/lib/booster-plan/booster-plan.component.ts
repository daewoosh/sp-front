import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TextWithCheckComponent } from "@sp/common";
import { BoosterCarouselComponent } from "./booster-carousel/booster-carousel.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-booster-plan',
  templateUrl: './booster-plan.component.html',
  styleUrls: ['./booster-plan.component.scss'],
  standalone: true,
  imports: [CommonModule, TextWithCheckComponent, BoosterCarouselComponent, RouterLink]
})
export class BoosterPlanComponent {

}
