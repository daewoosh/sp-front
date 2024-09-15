import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-advanced-results',
  templateUrl: './advanced-results.component.html',
  styleUrls: ['./advanced-results.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AdvancedResultsComponent  {

  constructor(public localStorage: LocalStorageService) { }


}
