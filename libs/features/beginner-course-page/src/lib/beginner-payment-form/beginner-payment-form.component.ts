import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeadFormComponent } from '@sp/common/lead-form';

@Component({
  selector: 'sp-beginner-payment-form',
  templateUrl: './beginner-payment-form.component.html',
  styleUrls: ['./beginner-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, LeadFormComponent],
})
export class BeginnerPaymentFormComponent {}
