import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainTopComponent } from "../main-top/main-top.component";
import { MainDiagramComponent } from "../main-diagram/main-diagram.component";
import { MainProjectComponent } from "../main-project/main-project.component";
import { MainReviewComponent } from "../main-review/main-review.component";
import { MainSocialComponent } from "../main-social/main-social.component";
import { MainChoosePathComponent } from "../main-choose-path/main-choose-path.component";

@Component({
  selector: 'lib-main-page',
  standalone: true,
  imports: [CommonModule, MainTopComponent, MainDiagramComponent, MainProjectComponent, MainReviewComponent, MainSocialComponent, MainChoosePathComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {}
