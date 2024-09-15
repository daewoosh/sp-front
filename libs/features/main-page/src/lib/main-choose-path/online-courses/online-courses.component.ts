import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NavigationService } from "@sp/core/providers";
import { TextWithCheckComponent } from "@sp/common";
import { ChoosePathBlockComponent } from "../choose-path-block/choose-path-block.component";

@Component({
  selector: 'sp-online-courses',
  templateUrl: './online-courses.component.html',
  styleUrls: ['./online-courses.component.scss'],
  standalone: true,
  imports: [CommonModule, TextWithCheckComponent, ChoosePathBlockComponent],
})
export class OnlineCoursesComponent {

  constructor(public navService:NavigationService) { }

}
