import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TextWithCheckComponent } from "@sp/common";

@Component({
  selector: 'sp-why-course',
  templateUrl: './why-course.component.html',
  styleUrls: ['./why-course.component.scss'],
  standalone: true,
  imports: [CommonModule, TextWithCheckComponent]
})
export class WhyCourseComponent { }
