import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from "@sp/core/models/user-profile";

@Component({
  selector: 'sp-courses-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-profile.component.html',
  styleUrl: './courses-profile.component.scss',
})
export class CoursesProfileComponent {
  @Input() profile!: UserProfile;
}
