import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-analysis-top',
  templateUrl: './analysis-top.component.html',
  styleUrls: ['./analysis-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AnalysisTopComponent  {

  constructor(public localStorage: LocalStorageService) { }

}
