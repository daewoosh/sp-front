import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from '@sp/common/lead-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-booster-payment',
  templateUrl: './booster-payment.component.html',
  styleUrls: ['./booster-payment.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadFormComponent, RouterLink],
})
export class BoosterPaymentComponent {
  @Input() showOtherProducts = true;
}
