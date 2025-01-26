import { Component, inject, Input, OnInit } from '@angular/core';
import {
  CellColor,
  RangeTableCellConfiguration,
  RangeTableData,
} from '@sp/core/models';
import { NgForOf } from '@angular/common';
import { TuiColorSelectorModule } from '@taiga-ui/legacy';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormArray,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RangeTableColorSelectorComponent } from '../../range-table-color-selector/range-table-color-selector.component';
import { v4 as uuid } from 'uuid';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'sp-ranges-table-edit',
  standalone: true,
  imports: [
    NgForOf,
    TuiColorSelectorModule,
    ReactiveFormsModule,
    RangeTableColorSelectorComponent,
    TuiIcon,
  ],
  templateUrl: './ranges-table-edit.component.html',
  styleUrl: './ranges-table-edit.component.scss',
})
export class RangesTableEditComponent implements OnInit {
  @Input() public tableData!: RangeTableData;
  private readonly sanitizer = inject(DomSanitizer);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cellColors: this.fb.array([]),
      multiColors: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.tableData) {
      this.initializeForm(this.tableData.config);
    } else {
      // Инициализация с пустыми массивами или данными по умолчанию
      this.addCellColor(); // Добавляем одну cellColor по умолчанию
      // this.addMultiColor(); // Добавляем одну multiColor по умолчанию
    }

    this.form.valueChanges.subscribe((value) => {
      console.log('Измененное значение формы:', value);
    });
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
    // if (data.multiColors && data.multiColors.length) {
    //   data.multiColors.forEach((multiColor, index) => {
    //     this.addMultiColor(multiColor);
    //   });
    // }
  }

  // Методы для управления cellColors
  get cellColors(): FormArray<FormControl<CellColor>> {
    return this.form.get('cellColors') as FormArray<FormControl<CellColor>>;
  }

  addCellColor(cellColor?: CellColor): void {
    const color: CellColor = cellColor || {
      id: uuid(),
      color: '#0b4324',
      text: 'New Color',
      order: this.cellColors.length, // Автоматическое назначение порядка
    };
    const cellColorControl = this.fb.control<CellColor>(color, {
      validators: Validators.required,
      nonNullable: true,
    });
    this.cellColors.push(cellColorControl);
    this.updateOrders();
  }

  removeCellColor(index: number): void {
    this.cellColors.removeAt(index);
    this.updateOrders();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const config: RangeTableCellConfiguration = this.form.value;
      console.log('Сохраненная конфигурация:', config);
      // Здесь можно обработать данные, например, отправить на сервер
    } else {
      console.log('Форма не валидна');
      this.form.markAllAsTouched();
    }
  }

  private updateOrders(): void {
    this.cellColors.controls.forEach((control, index) => {
      control.get('order')?.setValue(index, { emitEvent: true });
    });
  }
}
