import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-more-products',
  templateUrl: './more-products.component.html',
  styleUrls: ['./more-products.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class MoreProductsComponent {}
