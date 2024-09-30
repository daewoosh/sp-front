import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";

@Component({
  selector: 'sp-analysis-payment-form',
  templateUrl: './analysis-payment-form.component.html',
  styleUrls: ['./analysis-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AnalysisPaymentFormComponent implements OnInit, AfterViewInit {

  @ViewChild('formContainer') formContainer!: ElementRef;
  form!: FormGroup;
  fragment: string | null = '';


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit() {
    const s = this.document.createElement('script');
    s.innerHTML = '!function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1358424",hash:"e6a966d23002a617bb64f955ae774473",locale:"ru"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");';
    this.formContainer.nativeElement.appendChild(s);

    const s1 = this.document.createElement('script');
    s1.id = 'amoforms_script_1358424';
    s1.async = true;
    s1.charset = 'utf-8';
    s1.src = 'https://forms.kommo.com/forms/assets/js/amoforms.js?1719518336';
    this.formContainer.nativeElement.appendChild(s1);
  }

}
