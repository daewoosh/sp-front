// payment-form-component-base.ts
import { AfterViewInit, ElementRef, Inject, OnDestroy, ViewChild, Input, Directive } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive()
export abstract class BaseAmoFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('formContainer') formContainer!: ElementRef;

  @Input() showOtherProducts = true;

  protected scriptElements: HTMLScriptElement[] = [];

  // Abstract properties to be defined in derived components
  protected abstract formId: string;
  protected abstract formHash: string;
  protected abstract formLocale: string;
  protected abstract scriptSrc: string;

  constructor(@Inject(DOCUMENT) protected document: Document) {}

  ngAfterViewInit() {
    // Remove any existing scripts or content in formContainer
    this.formContainer.nativeElement.innerHTML = '';

    // Create and append the first script element
    const script1 = this.document.createElement('script');
    script1.innerHTML = `!function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"${this.formId}",hash:"${this.formHash}",locale:"${this.formLocale}"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");`;
    this.formContainer.nativeElement.appendChild(script1);

    // Create and append the second script element
    const script2 = this.document.createElement('script');
    script2.id = `amoforms_script_${this.formId}`;
    script2.async = true;
    script2.charset = 'utf-8';
    script2.src = this.scriptSrc;
    this.formContainer.nativeElement.appendChild(script2);

    // Store references to the scripts for cleanup
    this.scriptElements.push(script1, script2);
  }

  ngOnDestroy() {
    // Remove dynamically added scripts
    this.scriptElements.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scriptElements = [];

    // Clear the form container
    if (this.formContainer && this.formContainer.nativeElement) {
      this.formContainer.nativeElement.innerHTML = '';
    }
  }
}
