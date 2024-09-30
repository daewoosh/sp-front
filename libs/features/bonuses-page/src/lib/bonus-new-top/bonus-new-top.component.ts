import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-bonus-new-top',
  templateUrl: './bonus-new-top.component.html',
  styleUrls: ['./bonus-new-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class BonusNewTopComponent {

  constructor(public localStorage: LocalStorageService) {
  }

}
