import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "@sp/common/footer";
import { LandingHeaderComponent } from "@sp/common";
import { OnlyPokerPageComponent } from "@sp/only-poker-page";
import { TuiRoot } from "@taiga-ui/core";
import { BoosterPageComponent } from "@sp/booster-page";

@Component({
  standalone: true,
  imports: [RouterModule, FooterComponent, LandingHeaderComponent, OnlyPokerPageComponent, TuiRoot, BoosterPageComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'booster';
}
