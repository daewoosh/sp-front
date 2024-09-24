import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { AdminNavigationComponent } from "../admin-navigation/admin-navigation.component";
import { AdminApiService } from "../admin.api.service";

@Component({
  selector: 'sp-admin-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavigationComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  providers: [AdminApiService]
})
export class AdminPageComponent {}
