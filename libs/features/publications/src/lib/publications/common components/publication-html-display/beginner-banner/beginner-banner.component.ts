import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-beginner-banner',
  templateUrl: './beginner-banner.component.html',
  styleUrls: ['./beginner-banner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule]
})
export class BeginnerBannerComponent {}
