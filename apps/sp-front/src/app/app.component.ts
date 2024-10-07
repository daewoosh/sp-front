import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpCoreModule } from "@sp/core";
import { ViewportScroller } from "@angular/common";

@Component({
  standalone: true,
  imports: [RouterModule, TuiRoot, SpCoreModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {

  constructor(viewport: ViewportScroller) {
    viewport.setOffset([0, 100]);
  }

}
