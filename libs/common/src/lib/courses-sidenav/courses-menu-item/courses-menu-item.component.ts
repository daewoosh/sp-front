import { Component, Input } from '@angular/core';
import { MenuItem } from "../menu-items";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TuiDialogService } from "@taiga-ui/core";
import { NgIf } from "@angular/common";

@Component({
  selector: 'sp-courses-menu-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './courses-menu-item.component.html',
  styleUrl: './courses-menu-item.component.scss'
})
export class CoursesMenuItemComponent {
  @Input() menuItem!: MenuItem;

  constructor(private dialogs: TuiDialogService) {
  }
}
