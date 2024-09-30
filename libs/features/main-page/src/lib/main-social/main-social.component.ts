import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SocialItemComponent } from "./social-item/social-item.component";

@Component({
  selector: 'sp-main-social',
  templateUrl: './main-social.component.html',
  styleUrls: ['./main-social.component.scss'],
  standalone: true,
  imports: [CommonModule, SocialItemComponent],
})
export class MainSocialComponent {
}
