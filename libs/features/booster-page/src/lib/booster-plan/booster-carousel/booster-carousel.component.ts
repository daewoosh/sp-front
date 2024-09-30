import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TuiCarousel, TuiPagination } from "@taiga-ui/kit";
import { HoldemImgComponent } from "./holdem-img/holdem-img.component";
import { TuiItem } from "@taiga-ui/cdk";
import { TextWithCheckComponent } from "@sp/common";

@Component({
  selector: 'sp-booster-carousel',
  templateUrl: './booster-carousel.component.html',
  styleUrls: ['./booster-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiCarousel, HoldemImgComponent, TuiItem, TuiPagination, TextWithCheckComponent]
})
export class BoosterCarouselComponent {

  index = 0;
  duration = 6000;

  prev() {
    this.index--;
    if (this.index < 0) {
      this.index = 3;
    }
    this.duration = 0;
  }

  next() {
    this.index++;
    if (this.index > 3) {
      this.index = 0;
    }
    this.duration = 0;
  }

}
