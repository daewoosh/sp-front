import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RangeTableCell,
  RangeTableCellConfiguration, RangeTableCellDto, RangeTableColor,
  RangeTableData
} from '@sp/core/models';
import { TuiHint, TuiHintComponent } from '@taiga-ui/core';

@Component({
  selector: 'sp-range-table-display',
  standalone: true,
  imports: [CommonModule, TuiHintComponent, TuiHint],
  templateUrl: './range-table-display.component.html',
  styleUrls: ['./range-table-display.component.scss'],
})
export class RangeTableDisplayComponent {
  @Input() tableData!: RangeTableData;
  @Input() config!: RangeTableCellConfiguration;
  @Input() selectedColorId: string | null = null;
  @Output() cellClick = new EventEmitter<RangeTableCell>();
  isMouseDown = false;
  lastHoveredCell: RangeTableCell | null = null; // Последняя ячейка, над которой была мышь

  // Оптимизация *ngFor
  trackByCellKey(index: number, cell: RangeTableCell): string {
    return cell.key;
  }

  // Обработка рисования с зажатой кнопкой мыши
  onMouseDown(cell: RangeTableCell) {
    this.isMouseDown = true;
    this.toggleCellColor(cell);
    this.lastHoveredCell = cell; // Запоминаем ячейку, на которой начали рисование
  }

  onMouseOver(cell: RangeTableCell) {
    if (this.isMouseDown && this.selectedColorId) {
      // Если мышь перешла на новую ячейку или вернулась на ту же ячейку
      if (this.lastHoveredCell !== cell) {
        this.toggleCellColor(cell);
        this.lastHoveredCell = cell; // Обновляем последнюю ячейку
      }
    }
  }

  onMouseUp() {
    this.isMouseDown = false;
    this.lastHoveredCell = null; // Сбрасываем последнюю ячейку
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp() {
    this.isMouseDown = false;
    this.lastHoveredCell = null; // Сбрасываем последнюю ячейку
  }

  toggleCellColor(cell: RangeTableCell) {
    if (this.selectedColorId) {
      if (cell.colorEntityId === this.selectedColorId) {
        cell.colorEntityId = null;
      } else {
        cell.colorEntityId = this.selectedColorId;
      }
    }
  }

  // Получение данных для отображения цветов
  getColorData(cell: RangeTableCell): RangeTableColor[] {
    if (!cell.colorEntityId) {
      return [];
    }

    const cellColor = this.config.cellColors.find(
      (color) => color.id === cell.colorEntityId
    );
    if (cellColor) {
      return [{ color: cellColor.color, text: cellColor.text, percent: 100 }];
    }

    const multiColor = this.config.multiColors.find(
      (mc) => mc.id === cell.colorEntityId
    );
    if (multiColor) {
      return multiColor.cellColors.map((color, index) => ({
        color: color.color,
        text: color.text,
        percent: multiColor.percent[index],
      }));
    }

    return [];
  }
}
