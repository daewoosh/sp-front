import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingHeaderComponent } from "@sp/common";

@Component({
  standalone: true,
  imports: [ RouterModule, LandingHeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'only-poker';
}
