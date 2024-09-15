import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusNewTopComponent } from "../bonus-new-top/bonus-new-top.component";
import { BonusRoomsComponent } from "../bonus-rooms/bonus-rooms.component";
import { BonusListComponent } from "../bonus-list/bonus-list.component";

@Component({
  selector: 'sp-front-bonuses-page',
  standalone: true,
  imports: [CommonModule, BonusNewTopComponent, BonusRoomsComponent, BonusListComponent],
  templateUrl: './bonuses-page.component.html',
  styleUrl: './bonuses-page.component.scss',
})
export class BonusesPageComponent {}
