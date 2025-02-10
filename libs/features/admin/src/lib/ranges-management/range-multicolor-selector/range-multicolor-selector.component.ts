import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { CellColor, CellMulticolorConfiguration } from '@sp/core/models';
import { CommonModule } from '@angular/common';
import { NouisliderComponent } from 'ng2-nouislider';
import { TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'sp-range-multicolor-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NouisliderComponent,
    TuiIcon,
    TuiDropdown,
    TuiObscured,
    TuiActiveZone,
  ],
  templateUrl: './range-multicolor-selector.component.html',
  styleUrl: './range-multicolor-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeMulticolorSelectorComponent),
      multi: true,
    },
  ],
})
export class RangeMulticolorSelectorComponent
  implements ControlValueAccessor, OnInit
{
  form: FormGroup;
  sliderConfig: any;
  @Input() public colors: CellColor[] = [];

  showSlider = true;
  protected open = false;

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: [uuid()],
      cellColors: [[]],
      percent: [[]],
      order: [0],
    });

    this.sliderConfig = {
      connect: false,
      step: 1,
      tooltips: true,
      range: {
        min: 0,
        max: 100,
      },
    };

    this.form.get('percent')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
      let newPercent: number[];
      if (!Array.isArray(value)) {
        // Если это массив, добавляем новое значение
        newPercent = [value];
        this.form.get('percent')?.patchValue(newPercent);
      }
    });
  }

  get cellColors(): FormArray<FormControl<CellColor>> {
    return this.form.get('cellColors') as FormArray<FormControl<CellColor>>;
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

  writeValue(obj: CellMulticolorConfiguration): void {
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

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  addColor(cellColor: CellColor) {
    const addedColors = this.cellColors.value;
    addedColors.push(cellColor);
    this.cellColors.setValue(addedColors , {emitEvent: false});
    this.addPercent();
  }

  addPercent() {
    const percent = this.form.get('percent')?.value;

    // Проверяем, является ли percent массивом
    let newPercent: number[];
    if (Array.isArray(percent)) {
      // Если это массив, добавляем новое значение
      newPercent = [...percent, 75];
    } else {
      // Если это не массив, создаем новый массив с текущим значением и новым значением
      newPercent = percent !== undefined && percent !== null ? [percent, 75] : [75];
    }

    // Сортируем массив
    newPercent.sort((a: number, b: number) => a - b);

    // Обновляем форму
    this.showSlider = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.form.get('percent')?.patchValue(newPercent);
      this.showSlider = true;
      this.cdr.detectChanges();
    }, 10);
  }

  removeMultiColor(i: number) {
    const addedColors = this.cellColors.value;
    addedColors.splice(i,1 );
    this.cellColors.setValue(addedColors , {emitEvent: false});
    const percent = this.form.get('percent')?.value as number[];
    percent?.splice(i,1);
    this.showSlider= false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.form.get('percent')?.patchValue(percent);
      this.showSlider= true;
      this.cdr.detectChanges();
    },10);
  }
}
