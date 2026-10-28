import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { AbstractTuiControl, TuiColorSelectorModule } from '@taiga-ui/legacy';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/i;

/** Разбирает #RGB / RRGGBB / #RRGGBBAA / rgb(a)(...) в [r, g, b, alpha]; null — не цвет. */
function parseColor(color: string): [number, number, number, number] | null {
  const value = color.trim();

  const hex = HEX_COLOR.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    const [r, g, b, a = 255] = (full.match(/../g) ?? []).map((c) => parseInt(c, 16));
    return [r, g, b, Math.round((a / 255) * 100) / 100];
  }

  const rgb = RGB_COLOR.exec(value);
  if (rgb) {
    const [r, g, b] = rgb.slice(1, 4).map(Number);
    if ([r, g, b].some((c) => c > 255)) {
      return null;
    }
    return [r, g, b, rgb[4] === undefined ? 1 : Math.min(Number(rgb[4]), 1)];
  }

  return null;
}

const toHex = (channels: number[]) => `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

/** Код для поля ввода: #rrggbb, при прозрачности #rrggbbaa. */
export function toHexColor(color: string): string | null {
  const parsed = parseColor(color);
  if (!parsed) {
    return null;
  }
  const [r, g, b, a] = parsed;
  return toHex(a < 1 ? [r, g, b, Math.round(a * 255)] : [r, g, b]);
}

/**
 * Значение для хранения: #rrggbb, при прозрачности rgba(...) —
 * 8-значный hex tui-color-selector не разбирает (превращает в чёрный).
 */
export function toStoredColor(color: string): string | null {
  const parsed = parseColor(color);
  if (!parsed) {
    return null;
  }
  const [r, g, b, a] = parsed;
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : toHex([r, g, b]);
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
    this.value = toStoredColor(color) ?? color;
  }

  protected onHexInput(text: string): void {
    const color = toStoredColor(text);
    if (color) {
      this.value = color;
    }
  }
}
