import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BonusItemBeginnerComponent } from "./bonus-item-beginner/bonus-item-beginner.component";
import { BonusItemVideosComponent } from "./bonus-item-videos/bonus-item-videos.component";
import { BonusItemCourseComponent } from "./bonus-item-course/bonus-item-course.component";

@Component({
  selector: 'sp-bonus-list',
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss'],
  standalone: true,
  imports: [CommonModule, BonusItemBeginnerComponent, BonusItemVideosComponent, BonusItemCourseComponent],
})
export class BonusListComponent {

}
