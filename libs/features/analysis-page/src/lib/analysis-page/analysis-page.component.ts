import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisTopComponent } from "../analysis-top/analysis-top.component";
import { AnalysisAboutComponent } from "../analysis-about/analysis-about.component";
import { AnalysisCompositionComponent } from "../analysis-composition/analysis-composition.component";
import { AnalysisContentComponent } from "../analysis-content/analysis-content.component";
import { AnalysisPriceComponent } from "../analysis-price/analysis-price.component";
import { AnalysisPaymentFormComponent } from "../analysis-payment-form/analysis-payment-form.component";
import { LEAD_FORM_NAME } from '@sp/config';

@Component({
  selector: 'sp-analysis-page',
  standalone: true,
  imports: [CommonModule, AnalysisTopComponent, AnalysisAboutComponent, AnalysisCompositionComponent, AnalysisContentComponent, AnalysisPriceComponent, AnalysisPaymentFormComponent],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss',
  providers: [{
    provide: LEAD_FORM_NAME,
    useValue: 'analysis'
  }]
})
export class AnalysisPageComponent {}
