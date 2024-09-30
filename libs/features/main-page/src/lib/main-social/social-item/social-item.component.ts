import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-social-item',
  templateUrl: './social-item.component.html',
  styleUrls: ['./social-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SocialItemComponent {

  @Input() imageSrc = '';
  @Input() name = '';
  @Input() description = '';
  @Input() goToUrl = '';

}
