import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../header";
import { FooterComponent } from "../footer";
import { LocalStorageService, NavigationService } from "@sp/core/providers";
import { SpCoreModule } from "@sp/core";

@Component({
  selector: 'sp-page-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
  providers:[NavigationService,LocalStorageService]
})
export class PageLayoutComponent {}
