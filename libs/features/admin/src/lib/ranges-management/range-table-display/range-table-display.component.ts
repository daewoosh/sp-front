import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RangeTableCell,
  RangeTableCellConfiguration,
  RangeTableData,
} from '@sp/core/models';

@Component({
  selector: 'sp-range-table-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './range-table-display.component.html',
  styleUrl: './range-table-display.component.scss',
})
export class RangeTableDisplayComponent {
  @Input() tableData!: RangeTableData;
  @Input() config!: RangeTableCellConfiguration;
  @Input() selectedColorId: string | null = null;
  @Output() cellClick = new EventEmitter<RangeTableCell>();
  isMouseDown = false;
  onCellClick(event:MouseEvent,cell: RangeTableCell): void {
    event.stopPropagation();
    event.preventDefault();
    this.cellClick.emit(cell);
    if (this.selectedColorId) {
      if (cell.colorEntityId === this.selectedColorId) {
        cell.colorEntityId = null;
      } else {
        cell.colorEntityId = this.selectedColorId;
      }
    }
  }

  // Обработка рисования с зажатой кнопкой мыши
  onMouseDown(cell: RangeTableCell) {
    this.isMouseDown = true;
    this.toggleCellColor(cell);
  }

  onMouseOver(cell: RangeTableCell) {
    if (this.isMouseDown && this.selectedColorId) {
      this.toggleCellColor(cell);
    }
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp() {
    this.isMouseDown = false;
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

  getCellStyle(cell: RangeTableCell): any {
    if (!cell.colorEntityId) {
      return {};
    }

    // Проверяем, принадлежит ли colorEntityId к cellColors
    const cellColor = this.config.cellColors.find(
      (color) => color.id === cell.colorEntityId
    );
    if (cellColor) {
      return {
        'background-color': cellColor.color,
        width: '100%',
        height: '100%',
      };
    }

    // Проверяем, принадлежит ли colorEntityId к multiColors
    const multiColor = this.config.multiColors.find(
      (mc) => mc.id === cell.colorEntityId
    );
    if (multiColor) {
      // Создаем градиент на основе процентов и цветов
      const sorted = multiColor.percent
        .map((percent, index) => ({
          percent,
          color: multiColor.cellColors[index].color,
        }))
        .sort((a, b) => b.percent - a.percent); // Сортируем по убыванию

      let gradient = '';
      let previous = 0;
      sorted.forEach((item, index) => {
        gradient += `${item.color} ${previous}% ${item.percent}%`;
        previous = item.percent;
        if (index < sorted.length - 1) {
          gradient += ', ';
        }
      });

      return {
        background: `linear-gradient(to top, ${gradient})`,
      };
    }

    return {};
  }
}
