import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LEAD_FORM_NAME } from '@sp/config';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LeadsApiService } from '@sp/core/providers';

declare const fbq:any;


@Component({
  selector: 'sp-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss',
})
export class LeadFormComponent {
  form: FormGroup;

  constructor(
    @Inject(LEAD_FORM_NAME) public leadFormName: string,
    private fb: FormBuilder,
    private leadsApiService: LeadsApiService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(225)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(225)],
      ],
      phone: ['', [Validators.required, Validators.maxLength(225)]],
      telegram: ['', [Validators.required, Validators.maxLength(225)]],
    });
  }

  save() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.leadsApiService
      .saveLead({ ...this.form.value, leadFormName: this.leadFormName })
      .subscribe(() => {
        this.form.reset();
        this.form.get('name')?.setErrors(null);
        this.form.get('email')?.setErrors(null);
        this.form.get('phone')?.setErrors(null);
        this.form.get('telegram')?.setErrors(null);
        this.trackLead();
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'Это поле обязательно для заполнения';
    } else if (control?.hasError('email')) {
      return 'Введите корректный адрес электронной почты';
    }
    return '';
  }

  private trackLead() {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
    }
  }
}
