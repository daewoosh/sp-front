import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { AbstractTuiControl, TuiColorSelectorModule } from '@taiga-ui/legacy';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/i;

/** Приводит #RGB / RRGGBB / #RRGGBBAA / rgb(a)(...) к #rrggbb (#rrggbbaa при прозрачности); null — не цвет. */
export function toHexColor(color: string): string | null {
  const value = color.trim();

  const hex = HEX_COLOR.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    return `#${full.toLowerCase()}`;
  }

  const rgb = RGB_COLOR.exec(value);
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number);
    if (channels.some((c) => c > 255)) {
      return null;
    }
    const alpha = rgb[4] === undefined ? 1 : Math.min(Number(rgb[4]), 1);
    if (alpha < 1) {
      channels.push(Math.round(alpha * 255));
    }
    return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }

  return null;
}

@Component({
  selector: 'sp-color-selector-control',
  standalone: true,
  imports: [CommonModule, TuiColorSelectorModule, TuiDropdown],
  templateUrl: './color-selector-control.component.html',
  styleUrl: './color-selector-control.component.scss',
})
export class ColorSelectorControlComponent extends AbstractTuiControl<string> {

  private readonly sanitizer = inject(DomSanitizer);

  protected override getFallbackValue(): string {
    return '#0b4324';
  }
  override focused = false;
  // Пока поле кода в фокусе, не переписываем введённый текст нормализованным значением.
  protected editing = false;

  protected get background(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.value);
  }

  protected get hex(): string {
    return toHexColor(this.value ?? '') ?? this.value;
  }

  // Палитра отдаёт rgba(...) — храним hex, чтобы код цвета был читаемым и совпадал с импортом из Holdem.
  protected onPickerChange(color: string): void {
    this.value = toHexColor(color) ?? color;
  }

  protected onHexInput(text: string): void {
    const color = toHexColor(text);
    if (color) {
      this.value = color;
    }
  }
}
