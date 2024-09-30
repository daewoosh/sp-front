import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TextWithCheckComponent } from "@sp/common";

@Component({
  selector: 'sp-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [CommonModule, TextWithCheckComponent]
})
export class ResultComponent { }
