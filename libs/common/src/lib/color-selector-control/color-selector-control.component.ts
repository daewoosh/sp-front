import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { AbstractTuiControl, TuiColorSelectorModule } from '@taiga-ui/legacy';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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

  protected get background(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.value);
  }
}
