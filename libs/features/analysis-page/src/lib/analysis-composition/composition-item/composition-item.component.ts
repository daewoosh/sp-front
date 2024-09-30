import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-composition-item',
  templateUrl: './composition-item.component.html',
  styleUrls: ['./composition-item.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CompositionItemComponent {

  @Input() icon!: string;
  @Input() label!: string;
  @Input() text!: string;


}
