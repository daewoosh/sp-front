import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from '@sp/common/lead-form';

@Component({
  selector: 'sp-course-payment',
  templateUrl: './course-payment.component.html',
  styleUrls: ['./course-payment.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadFormComponent],
})
export class CoursePaymentComponent {
  @Input() showOtherProducts = true;
}
