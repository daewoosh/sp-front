import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingHeaderComponent } from "@sp/common";
import { FooterComponent } from "@sp/common/footer";
import { TuiRoot } from "@taiga-ui/core";
import { ViewportScroller } from "@angular/common";

@Component({
  standalone: true,
  imports: [RouterModule, LandingHeaderComponent, FooterComponent, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(viewport: ViewportScroller) {
    viewport.setOffset([0, 100]);
  }
}
