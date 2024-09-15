import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-beginner-top',
  templateUrl: './beginner-top.component.html',
  styleUrls: ['./beginner-top.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BeginnerTopComponent {

  constructor(public localStorage: LocalStorageService) { }
}
