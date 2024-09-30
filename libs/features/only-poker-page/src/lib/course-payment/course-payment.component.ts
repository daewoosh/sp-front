import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from "@angular/common";

@Component({
  selector: 'sp-course-payment',
  templateUrl: './course-payment.component.html',
  styleUrls: ['./course-payment.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CoursePaymentComponent implements AfterViewInit {

  @Input() showOtherProducts = true;

  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document) { }

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
