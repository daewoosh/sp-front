import { Component, Inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { WINDOW } from "@sp/sdk/common";

@Component({
  selector: 'sp-main-diagram',
  templateUrl: './main-diagram.component.html',
  styleUrls: ['./main-diagram.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MainDiagramComponent {

  constructor(@Inject(WINDOW) private window: Window,) { }

  openVideo() {
    this.window.open("https://www.youtube.com/watch?v=-P3QY4bMCyE",'_blank')
  }
}
