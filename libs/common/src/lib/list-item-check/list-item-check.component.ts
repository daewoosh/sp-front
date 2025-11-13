import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sp-list-item-check',
  standalone: true,
  imports: [NgIf],
  templateUrl: './list-item-check.component.html',
  styleUrl: './list-item-check.component.css',
})
export class ListItemCheckComponent {
  @Input() type: 'v' | 'x' | 'o' = 'x';
  @Input() text = '';
}
