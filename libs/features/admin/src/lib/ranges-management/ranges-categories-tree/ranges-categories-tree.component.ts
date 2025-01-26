import {
  Component,
  inject,
  Input,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeCategoryDto } from '@sp/core/models';
import { TuiTree } from '@taiga-ui/kit';
import { EMPTY_ARRAY, TuiHandler } from '@taiga-ui/cdk';
import { Router } from '@angular/router';

@Component({
  selector: 'sp-ranges-categories-tree',
  standalone: true,
  imports: [CommonModule, TuiTree],
  templateUrl: './ranges-categories-tree.component.html',
  styleUrl: './ranges-categories-tree.component.scss',
})
export class RangesCategoriesTreeComponent implements OnInit {
  @Input() categories: RangeCategoryDto[] = [];
  protected readonly map = new Map<RangeCategoryDto, boolean>();
  private router = inject(Router);

  ngOnInit() {
    this.addCategoriesToMap(this.categories);
  }

  selectAction(item: RangeCategoryDto) {
    if (item.level === 3) {
      this.router.navigate(['/manageRanges', item.id]);
    }
  }

  trackById: TrackByFunction<RangeCategoryDto> = (index, item) => item.id;

  protected readonly handler: TuiHandler<
    RangeCategoryDto,
    readonly RangeCategoryDto[]
  > = (item) => item.children || EMPTY_ARRAY;

  private addCategoriesToMap(categories: RangeCategoryDto[]): void {
    categories.forEach((category) => {
      this.map.set(category, false);
      if (category.children && category.children.length > 0) {
        this.addCategoriesToMap(category.children);
      }
    });
  }
}
