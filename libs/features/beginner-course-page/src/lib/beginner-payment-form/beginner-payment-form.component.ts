import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';

import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-beginner-payment-form',
  templateUrl: './beginner-payment-form.component.html',
  styleUrls: ['./beginner-payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BeginnerPaymentFormComponent implements AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  @ViewChild('formContainer') formContainer!: ElementRef;


  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: string) {

  }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const s = this.document.createElement("script");
      s.innerHTML = '!function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1025751",hash:"0cecb72c7fbae6bffbec6fa4375313f4",locale:"ru"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");';
      this.formContainer.nativeElement.appendChild(s);

      const s1 = this.document.createElement("script");
      s1.id = "amoforms_script_1025751";
      // @ts-ignore
      s1.async = "async";
      s1.charset = "utf-8";
      s1.src = "https://forms.kommo.com/forms/assets/js/amoforms.js?1683539434";
      this.formContainer.nativeElement.appendChild(s1);
    }
  }

  ngOnDestroy() {
    // Удаляем добавленные скрипты из DOM
    this.scriptElements.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    this.scriptElements = [];  // Очищаем массив ссылок на скрипты

    // Clear the form container
    if (this.formContainer && this.formContainer.nativeElement) {
      this.formContainer.nativeElement.innerHTML = '';
    }
  }
}
