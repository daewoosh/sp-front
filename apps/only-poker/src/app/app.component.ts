import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingHeaderComponent } from "@sp/common";
import { OnlyPokerPageComponent } from "@sp/only-poker-page";
import { FooterComponent } from "@sp/common/footer";
import { TuiRoot } from "@taiga-ui/core";

@Component({
  standalone: true,
  imports: [RouterModule, LandingHeaderComponent, OnlyPokerPageComponent, FooterComponent, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'only-poker';
}
