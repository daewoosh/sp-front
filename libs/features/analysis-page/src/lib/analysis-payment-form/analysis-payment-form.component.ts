import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from '@sp/common/lead-form';

@Component({
  selector: 'sp-analysis-payment-form',
  templateUrl: './analysis-payment-form.component.html',
  styleUrls: ['./analysis-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, LeadFormComponent],
})
export class AnalysisPaymentFormComponent {}
