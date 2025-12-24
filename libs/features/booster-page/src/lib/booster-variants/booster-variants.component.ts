import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemCheckComponent } from '@sp/common/list-item-check/list-item-check.component';

@Component({
  selector: 'sp-booster-variants',
  standalone: true,
  imports: [CommonModule, ListItemCheckComponent],
  templateUrl: './booster-variants.component.html',
  styleUrl: './booster-variants.component.scss',
})
export class BoosterVariantsComponent {}
