import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { BreakpointObserver } from "@angular/cdk/layout";
import { TuiCarouselComponent, TuiPagination } from "@taiga-ui/kit";
import { ReviewItemComponent } from "./review-item/review-item.component";
import { CommonModule } from "@angular/common";
import { TuiItem } from "@taiga-ui/cdk";

export interface Review {
  reviewer: string;
  position?: string;
  comment: string;
}

@Component({
  selector: 'sp-main-review',
  templateUrl: './main-review.component.html',
  styleUrls: ['./main-review.component.scss'],
  standalone: true,
  imports: [CommonModule, ReviewItemComponent, TuiCarouselComponent, TuiPagination, TuiItem],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainReviewComponent implements OnInit {


  @ViewChildren(ReviewItemComponent) items!: QueryList<ReviewItemComponent>;
  @Input() reviews: Review[] = [];
  itemsCount = 1;
  index = 0;

  constructor(private breakPointObserver: BreakpointObserver,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {


    this.breakPointObserver.observe([
      "(min-width: 850px)"
    ]).subscribe(
      res => {
        if (res.matches) {
          this.itemsCount = 2;
        } else {
          this.itemsCount = 1;
        }
        this.index = 0;
      }
    );
  }

  get rounded(): number {
    return Math.floor(this.index / this.itemsCount);
  }

  onIndex(index: number): void {
    this.index = (index * this.itemsCount);
  }

  prev(carousel: TuiCarouselComponent) {
    for (let i = 0; i < this.itemsCount; i++) {
      carousel.prev();
    }
  }

  next(carousel: TuiCarouselComponent) {
    for (let i = 0; i < this.itemsCount; i++) {
      carousel.next();
    }
  }

  navigate(delta: number) {
    this.index = (this.index + delta) % this.reviews.length;
    if (this.index < 0) {
      this.index = this.reviews.length + delta;
    }
    for (const item of this.items) {
      item.close();
    }
  }

  protected readonly Math = Math;
}
