import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeTableDto } from '@sp/core/models';
import { TuiHint } from '@taiga-ui/core';

@Component({
  selector: 'sp-range-table-display',
  standalone: true,
  imports: [CommonModule, TuiHint],
  templateUrl: './range-table-display.component.html',
  styleUrl: './range-table-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeTableDisplayComponent {
  @Input() defaultRangeTable!: RangeTableDto;
  @Input() rangeTable?: RangeTableDto | null = null;

  get tableToDisplay(): RangeTableDto {
    return this.rangeTable || this.defaultRangeTable;
  }
}
