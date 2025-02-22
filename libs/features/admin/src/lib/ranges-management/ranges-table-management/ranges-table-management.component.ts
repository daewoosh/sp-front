import {
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, map, Observable, of, share } from 'rxjs';
import {
  CellColor,
  CellMulticolorConfiguration,
  EditTableData,
  RangeTableCell,
  RangeTableData,
} from '@sp/core/models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectShowLoader } from '@sp/core/store/application';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RangesTableEditComponent } from './ranges-table-edit/ranges-table-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { v4 as uuid } from 'uuid';

export interface HoldemResponse {
  data: {
    category: {
      buttons: HoldemButtons[];
      rangedisplay2: {
        matrix: HoldemMatrixItem[];
      };
    };
  };
}

export interface HoldemButtons {
  name: string;
  color: string;
}

export interface HoldemMatrixItem {
  label: string;
  colors: { color: string; weight: number }[];
}

@Component({
  selector: 'sp-ranges-table-management',
  standalone: true,
  imports: [
    CommonModule,
    RangesTableEditComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './ranges-table-management.component.html',
  styleUrl: './ranges-table-management.component.scss',
})
export class RangesTableManagementComponent {
  public editPath$: Observable<string> = of('');
  public isLoading$: Observable<boolean> = of(false);
  public fromHoldem = '';
  showTable = true;
  isBrowser = false;
  private tableDataSubject = new BehaviorSubject<RangeTableData>(
    {} as RangeTableData
  );
  public tableData$ = this.tableDataSubject.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.isLoading$ = this.store.select(selectShowLoader);

      this.activatedRoute.data
        .pipe(
          map(({ tableData = {} }) => tableData as EditTableData),
          map((data) => data.table),
          share()
        )
        .subscribe((tableData) => {
          this.tableDataSubject.next(tableData);
        });

      this.editPath$ = this.activatedRoute.data.pipe(
        map(({ tableData = {} }) => tableData as EditTableData),
        map((data) => data.path),
        share()
      );
    }
  }

  parseHoldem() {
    this.showTable = false;
    this.cdr.detectChanges();
    const parsed: HoldemResponse = JSON.parse(this.fromHoldem);
    console.log(parsed);
    const parsed2 = this.transform(parsed);
    console.log(parsed2);
    this.tableDataSubject.next(parsed2);
    this.showTable = true;
    this.fromHoldem = '';
  }

  transform(response: HoldemResponse): RangeTableData {
    // Шаг 1: Создание базовых цветов
    const cellColors: CellColor[] = response.data.category.buttons.map(
      (button, index) => ({
        id: uuid(), // Генерация уникального ID
        color: button.color,
        text: button.name,
        order: index,
      })
    );

    // Шаг 2: Создание мультицветов
    const multiColors: CellMulticolorConfiguration[] = [];
    const colorCombinationMap = new Map<string, CellMulticolorConfiguration>();

    response.data.category.rangedisplay2.matrix.forEach((matrixItem) => {
      const colors = matrixItem.colors;

      // Если colors пустой, пропускаем создание мультицвета
      if (colors.length === 0) {
        return;
      }

      // Если colors содержит только один цвет
      if (colors.length === 1) {
        const color = colors[0];

        // Если weight равен 100%, используем базовый цвет
        if (color.weight === 100) {
          return;
        }

        // Если weight не равен 100%, создаем мультицвет
        const combinationKey = `${color.color}:${color.weight}`;

        // Если комбинация уже существует, пропускаем
        if (colorCombinationMap.has(combinationKey)) {
          return;
        }

        // Преобразуем вес в проценты
        const percent = [color.weight];

        // Находим соответствующий базовый цвет
        const baseColor = cellColors.find((bc) => bc.color === color.color);
        if (!baseColor) {
          throw new Error(`Базовый цвет ${color.color} не найден`);
        }

        // Создаем новый мультицвет
        const multiColor: CellMulticolorConfiguration = {
          id: uuid(),
          cellColors: [baseColor],
          percent: percent,
          order: multiColors.length,
        };

        // Сохраняем мультицвет в мапу и массив
        colorCombinationMap.set(combinationKey, multiColor);
        multiColors.push(multiColor);
        return;
      }

      // Если colors содержит несколько цветов, создаем мультицвет
      // Разворачиваем массив colors
      const reversedColors = [...colors].reverse();

      // Создаем ключ для комбинации цветов и весов
      const combinationKey = reversedColors
        .map((c) => `${c.color}:${c.weight}`)
        .join('|');

      // Если комбинация уже существует, пропускаем
      if (colorCombinationMap.has(combinationKey)) {
        return;
      }

      // Преобразуем веса в проценты
      const percent = this.calculatePercentages(reversedColors.map((c) => c.weight));

      // Находим соответствующие базовые цвета
      const cellColorsForMulti = reversedColors.map((c) => {
        const baseColor = cellColors.find((bc) => bc.color === c.color);
        if (!baseColor) {
          throw new Error(`Базовый цвет ${c.color} не найден`);
        }
        return baseColor;
      });

      // Создаем новый мультицвет
      const multiColor: CellMulticolorConfiguration = {
        id: uuid(),
        cellColors: cellColorsForMulti,
        percent: percent,
        order: multiColors.length,
      };

      // Сохраняем мультицвет в мапу и массив
      colorCombinationMap.set(combinationKey, multiColor);
      multiColors.push(multiColor);
    });

    // Шаг 3: Создание ячеек таблицы
    const cells: RangeTableCell[] =
      response.data.category.rangedisplay2.matrix.map((matrixItem) => {
        const colors = matrixItem.colors;

        // Если colors пустой, colorEntityId = null
        if (colors.length === 0) {
          return {
            key: matrixItem.label,
            colorEntityId: null,
          };
        }

        // Если colors содержит только один цвет
        if (colors.length === 1) {
          const color = colors[0];

          // Если weight равен 100%, используем базовый цвет
          if (color.weight === 100) {
            const baseColor = cellColors.find((bc) => bc.color === color.color);
            if (!baseColor) {
              throw new Error(`Базовый цвет ${color.color} не найден`);
            }
            return {
              key: matrixItem.label,
              colorEntityId: baseColor.id,
            };
          }

          // Если weight не равен 100%, используем мультицвет
          const combinationKey = `${color.color}:${color.weight}`;
          const multiColor = colorCombinationMap.get(combinationKey);
          if (!multiColor) {
            throw new Error(
              `Мультицвет для комбинации ${combinationKey} не найден`
            );
          }
          return {
            key: matrixItem.label,
            colorEntityId: multiColor.id,
          };
        }

        // Если colors содержит несколько цветов, используем мультицвет
        // Разворачиваем массив colors
        const reversedColors = [...colors].reverse();
        const combinationKey = reversedColors
          .map((c) => `${c.color}:${c.weight}`)
          .join('|');
        const multiColor = colorCombinationMap.get(combinationKey);
        if (!multiColor) {
          throw new Error(
            `Мультицвет для комбинации ${combinationKey} не найден`
          );
        }
        return {
          key: matrixItem.label,
          colorEntityId: multiColor.id,
        };
      });

    // Шаг 4: Создание итогового объекта RangeTableData
    const rangeTableData: RangeTableData = {
      cells: cells,
      config: {
        cellColors: cellColors,
        multiColors: multiColors,
      },
    };

    return rangeTableData;
  }

  // Вспомогательная функция для преобразования весов в проценты
  private calculatePercentages(weights: number[]): number[] {
    let cumulative = 0;
    return weights.map((weight) => {
      cumulative += weight;
      return cumulative;
    });
  }
}
