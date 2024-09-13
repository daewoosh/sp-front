import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SpCoreModule } from "@sp/core";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, TuiRoot, SpCoreModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sp-front';
}
