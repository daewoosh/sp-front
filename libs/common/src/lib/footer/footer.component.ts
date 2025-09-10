import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { EXCHANGE_URL } from '@sp/config';

@Component({
  selector: 'sp-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor(@Inject(EXCHANGE_URL) public exchangeUrl: string) {
  }
  public year = new Date().getFullYear();
}
