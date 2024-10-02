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

  protected showDialog(event:MouseEvent, content: any): void {
    if (!this.menuItem.isAvailable){
      event.stopPropagation();
      event.preventDefault();
      const dialog =this.dialogs.open(content, {appearance: 'sp-modal',})
      dialog.subscribe(
        {
          next: (data) => {
            console.info(`Dialog emitted data = ${data}`);
          },
          complete: () => {
            console.info('Dialog closed');
          },
        }
      );
    }
  }

  navigateToCourses() {

  }
}
