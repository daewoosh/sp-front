import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TextWithCheckComponent } from "@sp/common";

@Component({
  selector: 'sp-advanced-why',
  templateUrl: './advanced-why.component.html',
  styleUrls: ['./advanced-why.component.scss'],
  standalone: true,
  imports: [CommonModule, TextWithCheckComponent]
})
export class AdvancedWhyComponent {}
