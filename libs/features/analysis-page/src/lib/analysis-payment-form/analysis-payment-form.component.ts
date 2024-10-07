import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'sp-analysis-payment-form',
  templateUrl: './analysis-payment-form.component.html',
  styleUrls: ['./analysis-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AnalysisPaymentFormComponent implements AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: string) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
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
}
