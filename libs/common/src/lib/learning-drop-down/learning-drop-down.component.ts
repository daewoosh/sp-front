import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { TuiActiveZone, TuiObscured } from "@taiga-ui/cdk";
import { TuiDropdownDirective, TuiDropdownManual } from "@taiga-ui/core";
import { NavigationService } from "@sp/core/providers";

@Component({
  selector: 'sp-learning-drop-down',
  standalone: true,
  imports: [CommonModule, TuiActiveZone, TuiDropdownDirective, TuiDropdownManual, TuiObscured],
  templateUrl: './learning-drop-down.component.html',
  styleUrl: './learning-drop-down.component.scss',
})
export class LearningDropDownComponent {

  learningOpen = false;

  constructor(private router: Router,) {
  }

  onLearningClick(): void {
    this.learningOpen = !this.learningOpen;
  }

  onLearningObscured(obscured: boolean): void {
    if (obscured) {
      this.learningOpen = false;
    }
  }

  onLearningActiveZone(active: boolean) {
    this.learningOpen = active && this.learningOpen;
  }
  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }
}
