import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CompositionItemComponent } from "./composition-item/composition-item.component";

@Component({
  selector: 'sp-analysis-composition',
  templateUrl: './analysis-composition.component.html',
  styleUrls: ['./analysis-composition.component.scss'],
  standalone: true,
  imports: [CommonModule, CompositionItemComponent]
})
export class AnalysisCompositionComponent{}
