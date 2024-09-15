import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-beginner-diagram',
  templateUrl: './beginner-diagram.component.html',
  styleUrls: ['./beginner-diagram.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BeginnerDiagramComponent {

  constructor(public localStorage: LocalStorageService) { }
}
