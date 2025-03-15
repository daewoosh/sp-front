import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RangeCategoryDto } from '@sp/core/models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TuiDropdown, TuiScrollbar } from '@taiga-ui/core';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';

@Component({
  selector: 'sp-category-list',
  standalone: true,
  imports: [CommonModule, TuiScrollbar, TuiDropdown, TuiDropdownMobile],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  @Input() selectedParentId: number | null = null; // ID выбранной родительской категории
  @Input() levelInfo: { order: number; title: string } = {
    order: 1,
    title: '',
  }; // Информация о текущем уровне
  @Input() categories: RangeCategoryDto[] = []; // Список категорий для отображения
  @Input() selectedCategoryId: number | null = null; // ID выбранной категории
  @Input() queryParamKey = ''; // Ключ для параметра роута (например, 'blind', 'action', 'position')
  @Input() resetQueryParams: { [key: string]: null } = {}; // Параметры, которые нужно сбросить при выборе

  @Output() categorySelected = new EventEmitter<number>(); // Событие выбора категории
  isMobile = true;
  expanded = false;
  expandedByCategory = false;
  constructor(
    private router: Router,
    private breakPointObserver: BreakpointObserver
  ) {}

  get selectedCategory(): RangeCategoryDto | null {
    return (
      this.categories.find(
        (category) => category.id === this.selectedCategoryId
      ) || null
    );
  }

  ngOnInit() {
    this.breakPointObserver.observe(['(min-width: 992px)']).subscribe((res) => {
      if (res.breakpoints['(min-width: 992px)']) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    });
  }

  // Проверяет, выбрана ли категория
  isSelected(category: RangeCategoryDto): boolean {
    return category.id === this.selectedCategoryId;
  }

  // Обрабатывает выбор категории
  selectCategory(category: RangeCategoryDto): void {
    this.expanded = false;
    this.expandedByCategory = false;
    const categoryId = typeof category === 'number' ? category : category.id;
    if (categoryId !== this.selectedCategoryId) {
      this.categorySelected.emit(categoryId);
      this.router.navigate([], {
        queryParams: {
          [this.queryParamKey]: categoryId,
          ...this.resetQueryParams,
        },
        queryParamsHandling: 'merge',
      });
    }
  }
}
