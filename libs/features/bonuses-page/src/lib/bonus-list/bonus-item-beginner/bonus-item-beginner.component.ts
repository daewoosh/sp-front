import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ListItemWithDotComponent } from "@sp/common/list-item-with-dot";


@Component({
  selector: 'sp-bonus-item-beginner',
  templateUrl: './bonus-item-beginner.component.html',
  styleUrls: ['./bonus-item-beginner.component.scss'],
  standalone: true,
  imports: [CommonModule, ListItemWithDotComponent],
})
export class BonusItemBeginnerComponent {

}
