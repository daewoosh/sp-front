import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ListItemWithDotComponent } from "@sp/common/list-item-with-dot";

@Component({
  selector: 'sp-analysis-about',
  templateUrl: './analysis-about.component.html',
  styleUrls: ['./analysis-about.component.scss'],
  standalone: true,
  imports: [CommonModule, ListItemWithDotComponent]
})
export class AnalysisAboutComponent{}
