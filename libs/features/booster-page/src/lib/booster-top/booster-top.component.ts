import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-booster-top',
  templateUrl: './booster-top.component.html',
  styleUrls: ['./booster-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BoosterTopComponent {

}
