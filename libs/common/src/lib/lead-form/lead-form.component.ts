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
import { TextMaskConfig, TsMaskDirective } from '@sp/mask';
import { TuiAlertService, TuiLoader } from '@taiga-ui/core';

declare const fbq: any;

const DIGIT_REGEXP = /\d/;
const PHONE_REGEX = /^\+[0-9]{11,12}$/;

const PhoneMaskOptions: TextMaskConfig = {
  mask: () => [
    ...'+############'
      .split(``)
      .map((item) => (item === `#` ? DIGIT_REGEXP : item)),
  ],
  guide: false,
} as unknown as TextMaskConfig;

@Component({
  selector: 'sp-lead-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TsMaskDirective,
    TuiLoader,
  ],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss',
})
export class LeadFormComponent {
  form: FormGroup;

  isLoading = false;
  public tsMask: TextMaskConfig = PhoneMaskOptions;

  constructor(
    @Inject(LEAD_FORM_NAME) public leadFormName: string,
    private fb: FormBuilder,
    private leadsApiService: LeadsApiService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(225)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(225)],
      ],
      phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
      telegram: ['', [Validators.required, Validators.maxLength(225)]],
    });
  }

  save() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.leadsApiService
      .saveLead({ ...this.form.value, leadFormName: this.leadFormName })
      .subscribe({
        next: () => {
          this.form.reset();
          this.form.get('name')?.setErrors(null);
          this.form.get('email')?.setErrors(null);
          this.form.get('phone')?.setErrors(null);
          this.form.get('telegram')?.setErrors(null);
          this.trackLead();
          this.isLoading = false;
          this.alertService.open('Заявка успешно сохранена', {appearance: "info", autoClose: 5000}).subscribe();
        },
        error: () => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'Это поле обязательно для заполнения';
    } else if (control?.hasError('email')) {
      return 'Введите корректный адрес электронной почты';
    } else if (control?.hasError('pattern')) {
      return 'Введите корректный номер телефона';
    } else if (control?.hasError('maxlength')) {
      return `Максимальная длина поля ${
        control.getError('maxlength')?.requiredLength
      }`;
    }

    return '';
  }

  private trackLead() {
    if (
      this.leadFormName === 'onlypokerpromo' ||
      this.leadFormName === 'boosterpromo'
    ) {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
      }
    }
  }
}
