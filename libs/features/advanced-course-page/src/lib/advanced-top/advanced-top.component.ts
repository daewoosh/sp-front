import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-advanced-top',
  templateUrl: './advanced-top.component.html',
  styleUrls: ['./advanced-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AdvancedTopComponent {

  constructor(public localStorage: LocalStorageService) {
  }

}
