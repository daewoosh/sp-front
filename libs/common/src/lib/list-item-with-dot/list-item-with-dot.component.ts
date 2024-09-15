import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TuiExpandComponent } from "@taiga-ui/core";

@Component({
  selector: 'sp-list-item-with-dot',
  templateUrl: './list-item-with-dot.component.html',
  styleUrls: ['./list-item-with-dot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TuiExpandComponent],
})
export class ListItemWithDotComponent {

  @Input() text!: string;

}
