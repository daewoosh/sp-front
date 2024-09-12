import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TuiRoot, TuiLoader],
  selector: 'sp-front-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
