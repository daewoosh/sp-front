import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from "@angular/common";
import { PublicationShortDto, PublicationType } from "@sp/core/models";
import { ReadMoreItemComponent } from "./read-more-item/read-more-item.component";
import { MoreProductsComponent } from "../more-products/more-products.component";

@Component({
  selector: 'sp-publications-read-more',
  templateUrl: './publications-read-more.component.html',
  styleUrls: ['./publications-read-more.component.scss'],
  encapsulation:ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReadMoreItemComponent, MoreProductsComponent]
})
export class PublicationsReadMoreComponent {

  @Input() publications: PublicationShortDto[] = [];
  @Input() publicationType!: PublicationType;

}
