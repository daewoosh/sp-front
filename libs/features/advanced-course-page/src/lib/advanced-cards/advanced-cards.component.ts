import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-advanced-cards',
  templateUrl: './advanced-cards.component.html',
  styleUrls: ['./advanced-cards.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AdvancedCardsComponent {

  constructor(public localStorage: LocalStorageService) {
  }


}
