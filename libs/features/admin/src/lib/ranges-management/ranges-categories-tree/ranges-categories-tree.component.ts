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
import { ActivatedRoute, Router } from '@angular/router';

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
  private activatedRoute = inject(ActivatedRoute);
  selectedActionId = -1;
  ngOnInit() {
    this.addCategoriesToMap(this.categories);
    this.activatedRoute.firstChild?.params.subscribe((params) => {
      const {positionId} = params;
      if (positionId) {
        this.selectedActionId = +positionId;
        this.expandTreeForSelectedAction(this.selectedActionId);
      }
    });
  }

  private expandTreeForSelectedAction(selectedId: number): void {
    const path = this.findCategoryPath(this.categories, selectedId);
    if (path) {
      // Развернуть последние две категории в пути
      const levelsToExpand = 2;
      const start = Math.max(path.length - levelsToExpand - 1, 0);
      for (let i = start; i < path.length - 1; i++) { // Не разворачивать последнюю категорию (она уже выбрана)
        this.map.set(path[i], true);
      }
    }
  }

  private findCategoryPath(categories: RangeCategoryDto[], targetId: number, path: RangeCategoryDto[] = []): RangeCategoryDto[] | null {
    for (const category of categories) {
      const newPath = [...path, category];
      if (category.id === targetId) {
        return newPath;
      }
      if (category.children) {
        const result = this.findCategoryPath(category.children, targetId, newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
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
