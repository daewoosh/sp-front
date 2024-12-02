import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from '@sp/common/lead-form';

@Component({
  selector: 'sp-advanced-payment-form',
  templateUrl: './advanced-payment-form.component.html',
  styleUrls: ['./advanced-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadFormComponent],
})
export class AdvancedPaymentFormComponent {}
