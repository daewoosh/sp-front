import { Component, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { CellColor } from '@sp/core/models';
import { ColorSelectorControlComponent } from '@sp/common'; // Убедитесь, что у вас установлен uuid: npm install uuid

@Component({
  selector: 'sp-range-table-color-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorSelectorControlComponent,
  ],
  templateUrl: './range-table-color-selector.component.html',
  styleUrls: ['./range-table-color-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeTableColorSelectorComponent),
      multi: true,
    },
  ],
})
export class RangeTableColorSelectorComponent
  implements ControlValueAccessor, OnInit
{
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [uuid()],
      color: ['#000000', Validators.required],
      text: ['', Validators.required],
      order: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Обновление значения при изменении формы
    this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) {
        this.onChange(value);
        this.onTouched();
      }
    });
  }

  // Методы ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(obj: CellColor): void {
    if (obj) {
      this.form.setValue(obj, { emitEvent: false });
    } else {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  // Функции для управления фокусом (опционально)
  focused = false;
}
