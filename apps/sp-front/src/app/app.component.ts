import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { SpCoreModule } from "@sp/core";


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TuiRoot, TuiLoader, SpCoreModule],
  selector: 'sp-front-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
