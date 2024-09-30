import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-program-sub-item',
  templateUrl: './program-sub-item.component.html',
  styleUrls: ['./program-sub-item.component.scss'],
  standalone: true,
  imports:[CommonModule]
})
export class ProgramSubItemComponent {

  @Input() number = '';
  @Input() head = '';
  @Input() description = '';

}
