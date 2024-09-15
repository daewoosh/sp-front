import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-only-poker-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './only-poker-page.component.html',
  styleUrl: './only-poker-page.component.css',
})
export class OnlyPokerPageComponent {}
