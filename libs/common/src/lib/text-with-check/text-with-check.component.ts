import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-text-with-check',
  templateUrl: './text-with-check.component.html',
  styleUrls: ['./text-with-check.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TextWithCheckComponent  {

  @Input() margin = '6';

  @Input() text = ''

}
