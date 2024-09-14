import { Component, Input } from '@angular/core';
import { MenuItem } from "../menu-items";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TuiDialogService } from "@taiga-ui/core";

@Component({
  selector: 'sp-courses-menu-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './courses-menu-item.component.html',
  styleUrl: './courses-menu-item.component.scss'
})
export class CoursesMenuItemComponent {
  @Input() menuItem!: MenuItem;
}
