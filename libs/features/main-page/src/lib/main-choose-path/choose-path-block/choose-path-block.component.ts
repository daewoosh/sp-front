import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationService } from "@sp/core/providers";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-choose-path-block',
  templateUrl: './choose-path-block.component.html',
  styleUrls: ['./choose-path-block.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ChoosePathBlockComponent implements OnInit {

  @Input() name = '';
  @Input() imgSrc = ''
  @Input() header = '';
  @Input() goTo = '';

  @Input() imageMargin = '0px';
  @Input() bottomMargin = '0px';
  @Input() maxWidth = '330px';
  @Output() clickAction = new EventEmitter();

  constructor(private navService: NavigationService) {
  }

  ngOnInit(): void {
    this.goTo = this.navService.getUrlWithUtm(this.goTo);
  }

  onClick(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clickAction.emit();
  }
}
