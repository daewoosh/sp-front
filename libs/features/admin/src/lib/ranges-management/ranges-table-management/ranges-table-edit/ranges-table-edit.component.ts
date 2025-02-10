import { Component, inject, Input, OnInit } from '@angular/core';
import { CellColor, CellMulticolorConfiguration, RangeTableCellConfiguration, RangeTableData } from '@sp/core/models';
import { CommonModule } from '@angular/common';
import { TuiColorSelectorModule } from '@taiga-ui/legacy';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  RangeTableColorSelectorComponent
} from '../../range-table-color-selector/range-table-color-selector.component';
import { v4 as uuid } from 'uuid';
import { TuiIcon } from '@taiga-ui/core';
import { RangeMulticolorSelectorComponent } from '../../range-multicolor-selector/range-multicolor-selector.component';
import { RangeTableDisplayComponent } from '../../range-table-display/range-table-display.component';
import { AdminApiService } from '../../../admin.api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sp-ranges-table-edit',
  standalone: true,
  imports: [
    CommonModule,
    TuiColorSelectorModule,
    ReactiveFormsModule,
    RangeTableColorSelectorComponent,
    TuiIcon,
    RangeMulticolorSelectorComponent,
    FormsModule,
    RangeTableDisplayComponent
  ],
  templateUrl: './ranges-table-edit.component.html',
  styleUrl: './ranges-table-edit.component.scss'
})
export class RangesTableEditComponent implements OnInit {
  @Input() public tableData!: RangeTableData;
  @Input() public editPath = '';
  positionId = -1;
  form: FormGroup;
  public selectedColorEntity = '';
  private readonly sanitizer = inject(DomSanitizer);

  constructor(private fb: FormBuilder,
              private adminApiService: AdminApiService,
              private activatedRoute: ActivatedRoute) {
    this.form = this.fb.group({
      cellColors: this.fb.array<FormControl<CellColor>>([]),
      multiColors: this.fb.array<FormGroup<any>>([])
    });
    this.activatedRoute.paramMap.subscribe((params) => {
      this.positionId = +params.get('positionId')!;
    });
  }

  // Методы для управления cellColors
  get cellColors(): FormArray<FormControl<CellColor>> {
    return this.form.get('cellColors') as FormArray<FormControl<CellColor>>;
  }

  get multiColors(): FormArray<FormControl<any>> {
    return this.form.get('multiColors') as FormArray<FormControl<any>>;
  }

  ngOnInit(): void {
    if (this.tableData) {
      this.initializeForm(this.tableData.config);
    }

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.cellColors.valueChanges.subscribe(() => {
      this.syncMultiColorsWithCellColors();
    });
  }

  addCellColor(cellColor?: CellColor): void {
    const color: CellColor = cellColor || {
      id: uuid(),
      color: '#0b4324',
      text: 'New Color',
      order: this.cellColors.length // Автоматическое назначение порядка
    };
    const cellColorControl = this.fb.control<CellColor>(color, {
      validators: Validators.required,
      nonNullable: true
    });
    this.cellColors.push(cellColorControl);
    this.updateOrders();
  }

  removeCellColor(index: number): void {
    const removedColor = this.cellColors.at(index).value;
    this.cellColors.removeAt(index);
    this.updateOrders();

    // this.multiColors.controls.forEach((group) => {
    //   const colorsArray = group.get('cellColors') as FormArray<FormControl<CellColor>>;
    //   const colorToRemove = colorsArray.controls.find(
    //     (ctrl) => ctrl.value.id === removedColor.id
    //   );
    //   if (colorToRemove) {
    //     const colorIndex = colorsArray.controls.indexOf(colorToRemove);
    //     colorsArray.removeAt(colorIndex);
    //   }
    // });

    // Добавляем вызов для синхронизации (опционально)
    this.syncMultiColorsWithCellColors();
  }


  // Методы для управления multiColors
  addMultiColor(multiColor?: CellMulticolorConfiguration): void {
    if (this.cellColors.value.length<1){
      alert('Необходимо задать хотя бы один базовый цвет');
      return;
    }
    const newOrder = this.multiColors.length;
    const mc: CellMulticolorConfiguration = multiColor || {
      id: uuid(),
      cellColors: [this.cellColors.value[0]],
      percent: [50],
      order: newOrder + 1
    };

    const multiColorGroup = this.fb.control<CellMulticolorConfiguration>(mc, {
      validators: Validators.required,
      nonNullable: true
    });

    this.multiColors.push(multiColorGroup);
    this.updateMultiOrders();
  }

  removeMultiColor(index: number): void {
    this.multiColors.removeAt(index);
    this.updateMultiOrders();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const config: RangeTableCellConfiguration = this.form.value;
      console.log({ config, tableData: this.tableData });
      this.adminApiService.saveTable(this.positionId, { ...this.tableData, config }).subscribe();
      // Здесь можно обработать данные, например, отправить на сервер
    } else {
      console.log('Форма не валидна');
      this.form.markAllAsTouched();
    }
  }

  // Инициализация формы на основе входных данных
  private initializeForm(data: RangeTableCellConfiguration): void {
    // Инициализация cellColors
    if (data.cellColors && data.cellColors.length) {
      data.cellColors.forEach((cellColor, index) => {
        this.addCellColor(cellColor);
      });
    }

    // Инициализация multiColors
    if (data.multiColors && data.multiColors.length) {
      data.multiColors.forEach((multiColor) => {
        this.addMultiColor(multiColor);
      });
    }
  }

  private syncMultiColorsWithCellColors(): void {
    const updatedBaseColors = this.cellColors.value;

    this.multiColors.controls.forEach(control => {
      const multiConfig = control.value as CellMulticolorConfiguration;

      // Собираем новые массивы, оставляя только те базовые цвета, которые ещё существуют,
      // и корректно выравниваем массив percent по тем же индексам.
      const newCellColors: CellColor[] = [];
      const newPercents: number[] = [];
      multiConfig.cellColors.forEach((color, index) => {
        const found = updatedBaseColors.find(bc => bc.id === color.id);
        if (found) {
          newCellColors.push(found);
          newPercents.push(multiConfig.percent[index]);
        }
      });

      control.setValue({
        ...multiConfig,
        cellColors: newCellColors,
        percent: newPercents
      });
    });

    // this.multiColors.controls.forEach((group) => {
    //   const colorsArray = group.get('cellColors') as FormArray<FormControl<CellColor>>;
    //   const percentArray = group.get('percent') as FormArray<FormControl<number>>;
    //
    //   // Добавить новые цвета, если их больше в cellColors
    //   if (colorsArray.length < currentCellColors.length) {
    //     const newColors = currentCellColors.slice(colorsArray.length);
    //     newColors.forEach((color) => {
    //       colorsArray.push(this.fb.control<CellColor>(color, { nonNullable: true }));
    //       percentArray.push(this.fb.control<number>(0, [Validators.required, Validators.min(0), Validators.max(100)]));
    //     });
    //   }
    //
    //   // Удалить лишние цвета, если их меньше в cellColors
    //   if (colorsArray.length > currentCellColors.length) {
    //     const removeCount = colorsArray.length - currentCellColors.length;
    //     for (let i = 0; i < removeCount; i++) {
    //       colorsArray.removeAt(colorsArray.length - 1);
    //       percentArray.removeAt(percentArray.length - 1);
    //     }
    //   }
    // });
  }

  private updateOrders(): void {
    this.cellColors.controls.forEach((control, index) => {
      control.get('order')?.setValue(index, { emitEvent: true });
    });
  }

  private updateMultiOrders(): void {
    this.multiColors.controls.forEach((control, index) => {
      control.get('order')?.setValue(index, { emitEvent: false });
    });
  }
}
