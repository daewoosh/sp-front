import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss'],
  standalone: true,
  imports:[CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchVideoComponent {

  @Input() videoUrl!: string;

}
