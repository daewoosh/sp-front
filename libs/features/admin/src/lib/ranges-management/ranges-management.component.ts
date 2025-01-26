import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, share, take } from 'rxjs';
import { RangeCategoryDto } from '@sp/core/models';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { RangesCategoriesTreeComponent } from './ranges-categories-tree/ranges-categories-tree.component';
import { AdminApiService } from '../admin.api.service';

@Component({
  selector: 'sp-ranges-management',
  standalone: true,
  imports: [CommonModule, RangesCategoriesTreeComponent, RouterOutlet],
  templateUrl: './ranges-management.component.html',
  styleUrl: './ranges-management.component.scss',
  providers: [AdminApiService]
})
export class RangesManagementComponent {
  public categories$: Observable<RangeCategoryDto[]>;

  constructor(private activatedRoute: ActivatedRoute) {
    this.categories$ = this.activatedRoute.data.pipe(
      take(1),
      map(({ categories = {} }) => categories as RangeCategoryDto[]),
      share()
    );
  }
}
