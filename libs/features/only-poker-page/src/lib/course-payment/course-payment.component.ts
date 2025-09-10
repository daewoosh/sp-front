import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormComponent } from '@sp/common/lead-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-course-payment',
  templateUrl: './course-payment.component.html',
  styleUrls: ['./course-payment.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadFormComponent, RouterLink],
})
export class CoursePaymentComponent {
  @Input() showOtherProducts = true;
}
