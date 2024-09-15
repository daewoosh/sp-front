import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ListItemWithDotComponent } from "@sp/common/list-item-with-dot";

@Component({
  selector: 'sp-bonus-item-videos',
  templateUrl: './bonus-item-videos.component.html',
  styleUrls: ['./bonus-item-videos.component.scss'],
  standalone: true,
  imports: [CommonModule, ListItemWithDotComponent],
})
export class BonusItemVideosComponent {
}
