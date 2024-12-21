import { Component, Input } from '@angular/core';
import { Review } from '../main-review.component';
import { CommonModule } from '@angular/common';
import { TuiLineClamp } from '@taiga-ui/kit';

@Component({
  selector: 'sp-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiLineClamp],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewItemComponent {

  @Input() review!: Review;
  linesLimit = 3;

  toggle() {
    this.linesLimit = this.collapsed ? 100 : 3;
  }

   get collapsed(): boolean {
    return this.linesLimit === 3;
  }

  close(){
    this.linesLimit = 3;
  }
}
