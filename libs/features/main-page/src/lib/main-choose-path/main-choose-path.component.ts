import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ChoosePathBlockComponent } from "./choose-path-block/choose-path-block.component";
import { TextWithCheckComponent } from "@sp/common";
import { OnlineCoursesComponent } from "./online-courses/online-courses.component";
import { EXCHANGE_URL } from "@sp/config";

@Component({
  selector: 'sp-main-choose-path',
  templateUrl: './main-choose-path.component.html',
  styleUrls: ['./main-choose-path.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ChoosePathBlockComponent, TextWithCheckComponent, OnlineCoursesComponent],
})
export class MainChoosePathComponent {

  constructor(@Inject(EXCHANGE_URL) public exchangeUrl: string) {
  }


}
